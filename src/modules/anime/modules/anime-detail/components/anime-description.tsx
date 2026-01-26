import React from "react";

interface AnimeDescriptionProps {
  description: string | null;
  animeDescription: string | null;
}

export const AnimeDescription: React.FC<AnimeDescriptionProps> = ({
  description,
  animeDescription,
}) => {
  const content = animeDescription || description;

  if (!content) {
    return (
      <div className="text-muted-foreground text-center">
        Описание отсутствует
      </div>
    );
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="whitespace-pre-line leading-relaxed">{content}</p>
    </div>
  );
};
