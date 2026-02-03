import { Book, Palette, Music, Users, Mic } from "lucide-react";

import type { ReviewResponseDto } from "@/shared/api/generated/model";

interface ReviewCriteriaProps {
  review: ReviewResponseDto;
  className?: string;
}

interface CriterionItemProps {
  icon: React.ReactNode;
  label: string;
  rating: number;
}

function CriterionItem({ icon, label, rating }: CriterionItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-sm">{label}</span>
      <div className="ml-auto font-semibold tabular-nums">{rating}/10</div>
    </div>
  );
}

export function ReviewCriteria({ review, className }: ReviewCriteriaProps) {
  const criteria = [
    {
      key: "story_rating",
      icon: <Book className="h-4 w-4" />,
      label: "Сюжет",
      rating: review.story_rating,
    },
    {
      key: "animation_rating",
      icon: <Palette className="h-4 w-4" />,
      label: "Анимация",
      rating: review.animation_rating,
    },
    {
      key: "music_rating",
      icon: <Music className="h-4 w-4" />,
      label: "Музыка",
      rating: review.music_rating,
    },
    {
      key: "characters_rating",
      icon: <Users className="h-4 w-4" />,
      label: "Персонажи",
      rating: review.characters_rating,
    },
    {
      key: "voice_acting_rating",
      icon: <Mic className="h-4 w-4" />,
      label: "Озвучка",
      rating: review.voice_acting_rating,
    },
  ].filter((criterion) => criterion.rating !== null && criterion.rating !== undefined);

  if (criteria.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h4 className="text-muted-foreground mb-2 text-sm font-medium">
        Детальные оценки
      </h4>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {criteria.map((criterion) => (
          <CriterionItem
            key={criterion.key}
            icon={criterion.icon}
            label={criterion.label}
            rating={criterion.rating!}
          />
        ))}
      </div>
    </div>
  );
}
