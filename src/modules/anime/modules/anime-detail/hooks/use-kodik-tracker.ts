import { useCallback, useEffect, useRef } from "react";

import {
  useWatchTrackingControllerCreateSession,
  useWatchTrackingControllerEndSession,
  useWatchTrackingControllerHeartbeat,
} from "@/shared/api/generated/watch-tracking/watch-tracking";

interface KodikEvent {
  key: string;
  value?: string | number | boolean;
}

interface WatchSessionState {
  sessionId: number | null;
  watchedSeconds: number;
  maxPosition: number;
  durationSeconds: number;
  episode: number | null;
  season: number | null;
  translationId: number | null;
  translationTitle: string | null;
  playbackSpeed: number;
  skippedIntro: boolean;
  skippedOutro: boolean;
  seekCount: number;
  pauseCount: number;
}

export function useKodikTracker(animeId: number | undefined) {
  const sessionState = useRef<WatchSessionState>({
    sessionId: null,
    watchedSeconds: 0,
    maxPosition: 0,
    durationSeconds: 0,
    episode: null,
    season: null,
    translationId: null,
    translationTitle: null,
    playbackSpeed: 1.0,
    skippedIntro: false,
    skippedOutro: false,
    seekCount: 0,
    pauseCount: 0,
  });

  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  const createSessionMutation = useWatchTrackingControllerCreateSession();
  const heartbeatMutation = useWatchTrackingControllerHeartbeat();
  const endSessionMutation = useWatchTrackingControllerEndSession();

  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }

    heartbeatInterval.current = setInterval(() => {
      const state = sessionState.current;
      if (state.sessionId) {
        heartbeatMutation.mutate({ id: state.sessionId });
      }
    }, 30000); // Каждые 30 секунд
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  }, []);

  const endSession = useCallback(() => {
    const state = sessionState.current;
    if (!state.sessionId) return;

    endSessionMutation.mutate({
      id: state.sessionId,
      data: {
        watched_seconds: state.watchedSeconds,
        max_position: state.maxPosition,
        playback_speed: state.playbackSpeed,
        skipped_intro: state.skippedIntro,
        skipped_outro: state.skippedOutro,
        seek_count: state.seekCount,
        pause_count: state.pauseCount,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKodikMessage = useCallback(
    (event: MessageEvent<KodikEvent>) => {
      if (!animeId) return;

      const { key, value } = event.data;
      const state = sessionState.current;

      switch (key) {
        case "kodik_player_video_started":
          // Создаем новую сессию
          createSessionMutation.mutate(
            {
              data: {
                anime_id: animeId,
                episode: state.episode ?? undefined,
                season: state.season ?? undefined,
                translation_id: state.translationId ?? undefined,
                translation_title: state.translationTitle ?? undefined,
                duration_seconds: state.durationSeconds || 1500, // Дефолт 25 минут
              },
            },
            {
              onSuccess: (data) => {
                // Backend возвращает { id: number }, но OpenAPI spec указывает void
                // Type assertion безопасен, так как backend action подтверждает возврат id
                const response = data as unknown as { id: number };
                state.sessionId = response.id;
                startHeartbeat();
              },
            },
          );
          break;

        case "kodik_player_time_update":
          if (typeof value === "number") {
            const currentTime = Math.floor(value);
            state.watchedSeconds = currentTime;
            if (currentTime > state.maxPosition) {
              state.maxPosition = currentTime;
            }
          }
          break;

        case "kodik_player_duration_update":
          if (typeof value === "number") {
            state.durationSeconds = Math.floor(value);
          }
          break;

        case "kodik_player_current_episode":
          if (typeof value === "string") {
            const parts = value.split(":");
            if (parts.length === 2) {
              state.season = parseInt(parts[0], 10) || null;
              state.episode = parseInt(parts[1], 10) || null;
            }
          }
          break;

        case "kodik_player_video_ended":
          if (state.sessionId) {
            stopHeartbeat();
            endSession();
            state.sessionId = null;
          }
          break;

        case "kodik_player_speed_change":
          if (typeof value === "number") {
            state.playbackSpeed = value;
          }
          break;

        case "kodik_player_seek":
          state.seekCount += 1;
          break;

        case "kodik_player_pause":
          state.pauseCount += 1;
          break;

        case "kodik_player_skip_button":
          if (value === "intro") {
            state.skippedIntro = true;
          } else if (value === "outro") {
            state.skippedOutro = true;
          }
          break;

        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animeId],
  );

  useEffect(() => {
    if (!animeId) return;

    // Сброс состояния сессии при смене аниме
    sessionState.current = {
      sessionId: null,
      watchedSeconds: 0,
      maxPosition: 0,
      durationSeconds: 0,
      episode: null,
      season: null,
      translationId: null,
      translationTitle: null,
      playbackSpeed: 1.0,
      skippedIntro: false,
      skippedOutro: false,
      seekCount: 0,
      pauseCount: 0,
    };

    window.addEventListener("message", handleKodikMessage);

    return () => {
      window.removeEventListener("message", handleKodikMessage);
      stopHeartbeat();
      endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, handleKodikMessage]);
}
