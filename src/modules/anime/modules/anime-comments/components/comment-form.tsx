import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/utils/utils";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  isLoading?: boolean;
  replyToUsername?: string;
}

export function CommentForm({
  onSubmit,
  onCancel,
  initialValue = "",
  placeholder = "Написать комментарий...",
  submitLabel = "Отправить",
  isLoading = false,
  replyToUsername,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  const charCount = content.length;
  const maxChars = 5000;
  const isOverLimit = charCount > maxChars;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {replyToUsername && (
        <div className="text-muted-foreground text-sm">
          Ответ на @{replyToUsername}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "bg-background min-h-[100px] w-full rounded-md border p-3",
          "focus:ring-primary focus:ring-2 focus:outline-none",
          "resize-y",
          isOverLimit && "border-destructive focus:ring-destructive",
        )}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between">
        <div
          className={cn(
            "text-sm",
            isOverLimit ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {charCount} / {maxChars}
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Отмена
            </Button>
          )}
          <Button
            type="submit"
            disabled={!content.trim() || isOverLimit || isLoading}
          >
            {isLoading ? "Отправка..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
