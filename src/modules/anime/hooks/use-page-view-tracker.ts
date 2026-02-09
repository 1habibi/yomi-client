import { useEffect, useRef } from "react";

import { useAnalyticsControllerTrackPageView } from "@/shared/api/generated/analytics/analytics";

export function usePageViewTracker(
  animeId: number | undefined,
  referrer?: string,
) {
  const startTime = useRef<number>(Date.now());
  const trackPageViewMutation = useAnalyticsControllerTrackPageView();

  useEffect(() => {
    if (!animeId) return;

    startTime.current = Date.now();

    trackPageViewMutation.mutate({
      data: {
        anime_id: animeId,
        referrer: referrer || "direct",
      },
    });

    return () => {
      const duration = Date.now() - startTime.current;

      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          anime_id: animeId,
          duration_ms: duration,
          referrer: referrer || "direct",
        });

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        navigator.sendBeacon(`${apiUrl}/analytics/page-view`, data);
      } else {
        trackPageViewMutation.mutate({
          data: {
            anime_id: animeId,
            duration_ms: duration,
            referrer: referrer || "direct",
          },
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, referrer]);
}
