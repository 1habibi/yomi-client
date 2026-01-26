import React from "react";

interface AnimePlayerProps {
  link: string | null;
  title?: string | null;
}

export const AnimePlayer: React.FC<AnimePlayerProps> = ({ link, title }) => {
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
      </div>
    </div>
  );
};
