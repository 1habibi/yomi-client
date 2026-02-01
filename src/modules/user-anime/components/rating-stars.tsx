import { Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/common/utils/utils";

interface RatingStarsProps {
  rating?: number | null;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function RatingStars({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = "md",
  showLabel = true,
  className,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating || 0;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (value: number) => {
    if (readonly || !onRatingChange) return;
    onRatingChange(value);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
        <button
          key={value}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readonly && setHoverRating(value)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={cn(
            "transition-transform",
            !readonly && "cursor-pointer hover:scale-110",
            readonly && "cursor-default",
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              value <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300",
            )}
          />
        </button>
      ))}
      {showLabel && rating !== null && rating !== undefined && rating > 0 && (
        <span className="text-muted-foreground ml-2 text-sm">{rating}/10</span>
      )}
    </div>
  );
}
