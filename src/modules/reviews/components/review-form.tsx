import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/common/components/ui/button";
import { Checkbox } from "@/common/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/common/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import { Slider } from "@/common/components/ui/slider";
import { Textarea } from "@/common/components/ui/textarea";

const reviewSchema = z.object({
  overall_rating: z.number().min(1).max(10),
  story_rating: z.number().min(1).max(10).optional(),
  animation_rating: z.number().min(1).max(10).optional(),
  music_rating: z.number().min(1).max(10).optional(),
  characters_rating: z.number().min(1).max(10).optional(),
  voice_acting_rating: z.number().min(1).max(10).optional(),
  content: z
    .string()
    .min(200, "Минимальная длина рецензии - 200 символов")
    .max(10000, "Максимальная длина рецензии - 10000 символов"),
  has_spoilers: z.boolean(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  defaultValues?: Partial<ReviewFormValues>;
  isEdit?: boolean;
  onSubmit: (values: ReviewFormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ReviewForm({
  defaultValues,
  isEdit = false,
  onSubmit,
  onCancel,
  isLoading = false,
}: ReviewFormProps) {
  const [showDetailedCriteria, setShowDetailedCriteria] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overall_rating: defaultValues?.overall_rating || 5,
      story_rating: defaultValues?.story_rating,
      animation_rating: defaultValues?.animation_rating,
      music_rating: defaultValues?.music_rating,
      characters_rating: defaultValues?.characters_rating,
      voice_acting_rating: defaultValues?.voice_acting_rating,
      content: defaultValues?.content || "",
      has_spoilers: defaultValues?.has_spoilers ?? false,
    },
  });

  const contentLength = form.watch("content").length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="overall_rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Общая оценка *</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  <div className="text-center text-2xl font-bold">
                    {field.value}/10
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Collapsible
          open={showDetailedCriteria}
          onOpenChange={setShowDetailedCriteria}
        >
          <CollapsibleTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              {showDetailedCriteria ? "Скрыть" : "Показать"} детальные критерии
              (опционально)
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="story_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сюжет</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value || 5]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="text-center font-semibold">
                        {field.value || 5}/10
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="animation_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Анимация</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value || 5]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="text-center font-semibold">
                        {field.value || 5}/10
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="music_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Музыка</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value || 5]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="text-center font-semibold">
                        {field.value || 5}/10
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="characters_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Персонажи</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value || 5]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="text-center font-semibold">
                        {field.value || 5}/10
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="voice_acting_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Озвучка</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value || 5]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="text-center font-semibold">
                        {field.value || 5}/10
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Текст рецензии *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Напишите вашу рецензию... Используйте ||текст|| для спойлеров"
                  className="min-h-[200px] resize-y"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                {contentLength}/10000 символов (минимум 200)
                <br />
                Используйте ||текст|| для спойлеров (как в Telegram)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="has_spoilers"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Содержит спойлеры</FormLabel>
                <FormDescription>
                  Отметьте, если рецензия раскрывает важные детали сюжета
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Отправка..."
              : isEdit
                ? "Обновить рецензию"
                : "Отправить на модерацию"}
          </Button>
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
        </div>
      </form>
    </Form>
  );
}
