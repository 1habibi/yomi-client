import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/common/components/ui/button";
import { Field, FieldError } from "@/common/components/ui/field";
import { Textarea } from "@/common/components/ui/textarea";
import { cn } from "@/common/utils/utils";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Комментарий не может быть пустым")
    .max(5000, "Максимальная длина комментария - 5000 символов"),
});

type CommentFormData = z.infer<typeof commentSchema>;

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
  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialValue,
    },
  });

  const handleSubmit = (data: CommentFormData) => {
    onSubmit(data.content.trim());
    form.reset();
  };

  const contentValue = form.watch("content") || "";
  const charCount = contentValue.length;
  const maxChars = 5000;
  const isOverLimit = charCount > maxChars;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
      {form.formState.errors.root && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
          {form.formState.errors.root.message}
        </div>
      )}

      {replyToUsername && (
        <div className="text-muted-foreground text-sm">
          Ответ на @{replyToUsername}
        </div>
      )}

      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field
            className="flex flex-col gap-1.5"
            data-invalid={!!fieldState.error}
          >
            <Textarea
              placeholder={placeholder}
              className={cn(
                "min-h-[100px] resize-y",
                isOverLimit && "border-destructive focus:ring-destructive",
              )}
              disabled={isLoading}
              aria-invalid={!!fieldState.error}
              {...field}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
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
            disabled={!form.formState.isValid || isOverLimit || isLoading}
          >
            {isLoading ? "Отправка..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
