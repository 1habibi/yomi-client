import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";

import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/utils/utils";

import type { RecommendationItem } from "../types";

import { RecommendationCard } from "./recommendation-card";

interface RecommendationCarouselProps {
  title: string;
  items: RecommendationItem[];
  className?: string;
}

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  title,
  items,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((item) => (
          <div key={item.anime_id} className="w-[180px] flex-shrink-0">
            <RecommendationCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
};
