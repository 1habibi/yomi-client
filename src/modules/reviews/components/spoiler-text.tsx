import { useState } from "react";

import { cn } from "@/common/utils/utils";

import { parseSpoilers } from "../utils/spoiler-parser";

interface SpoilerTextProps {
  content: string;
  className?: string;
}

export function SpoilerText({ content, className }: SpoilerTextProps) {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(
    new Set(),
  );
  const parts = parseSpoilers(content);

  const handleSpoilerClick = (index: number) => {
    setRevealedSpoilers((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  return (
    <div className={cn("whitespace-pre-wrap break-words", className)}>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={index}>{part.content}</span>;
        }

        const isRevealed = revealedSpoilers.has(index);

        return (
          <span
            key={index}
            className={cn(
              "inline-block cursor-pointer rounded bg-muted px-1 transition-all",
              isRevealed ? "blur-none" : "select-none blur-sm",
            )}
            onClick={() => handleSpoilerClick(index)}
            title={isRevealed ? undefined : "Нажмите, чтобы показать спойлер"}
          >
            {part.content}
          </span>
        );
      })}
    </div>
  );
}
