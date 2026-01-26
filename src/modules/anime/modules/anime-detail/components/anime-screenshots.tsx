import React from "react";

import type { ScreenshotDto } from "@/shared/api/generated/model";

interface AnimeScreenshotsProps {
  screenshots: ScreenshotDto[];
}

export const AnimeScreenshots: React.FC<AnimeScreenshotsProps> = ({
  screenshots,
}) => {
  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="text-muted-foreground text-center">
        Скриншоты отсутствуют
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {screenshots.map((screenshot) => (
        <div
          key={screenshot.id}
          className="group relative aspect-video overflow-hidden rounded-lg bg-black"
        >
          {screenshot.url && (
            <img
              src={screenshot.url}
              alt="Скриншот"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  );
};
