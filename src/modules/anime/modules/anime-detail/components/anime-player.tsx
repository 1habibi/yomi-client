import React, { useEffect, useState } from "react";
import { ScanSearch } from "lucide-react";

import { Button } from "@/common/components/ui/button";

import { useKodikTracker } from "../hooks/use-kodik-tracker";
import { PlayerCharacterSearchModal } from "./player-character-search-modal";

interface AnimePlayerProps {
  link: string | null;
  title?: string | null;
  animeId?: number;
}

export const AnimePlayer: React.FC<AnimePlayerProps> = ({
  link,
  title,
  animeId,
}) => {
  useKodikTracker(animeId);
  const [isPaused, setIsPaused] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Слушаем события паузы/воспроизведения от Kodik через postMessage
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const key = event.data?.key;
      if (key === "kodik_player_pause") setIsPaused(true);
      if (
        key === "kodik_player_play" ||
        key === "kodik_player_video_started"
      ) {
        setIsPaused(false);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!link) {
    return (
      <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Видео недоступно</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black shadow-xl">
      <div className="relative aspect-video">
        <iframe
          src={link}
          title={title ?? "Видеоплеер"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Оверлей с кнопкой поиска — появляется при паузе.
            pointer-events-none на контейнере чтобы iframe оставался кликабельным,
            pointer-events-auto только на кнопке. */}
        {isPaused && (
          <div className="pointer-events-none absolute inset-0 z-10">
            <Button
              onClick={() => setIsSearchModalOpen(true)}
              variant="secondary"
              size="sm"
              className="pointer-events-auto absolute right-4 bottom-4 gap-1.5 bg-black/70 text-white backdrop-blur-sm hover:bg-black/90"
            >
              <ScanSearch className="h-4 w-4" />
              Кто этот персонаж?
            </Button>
          </div>
        )}
      </div>

      <PlayerCharacterSearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        animeTitle={title}
      />
    </div>
  );
};
