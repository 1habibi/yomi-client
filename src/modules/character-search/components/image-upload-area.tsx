import React, { useCallback, useRef, useState } from "react";
import { ClipboardPaste, Upload, X } from "lucide-react";

import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/utils/utils";

import { useClipboardPaste } from "../hooks/use-clipboard-paste";

interface ImageUploadAreaProps {
  onImageSelected: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  isLoading?: boolean;
  /** true для компактного отображения в модалке плеера */
  compact?: boolean;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onImageSelected,
  preview,
  onClear,
  isLoading = false,
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste активен только когда нет превью
  useClipboardPaste(containerRef, onImageSelected, !preview);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) {
        onImageSelected(file);
      }
    },
    [onImageSelected],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageSelected(file);
      // Сбрасываем input чтобы можно было загрузить тот же файл повторно
      e.target.value = "";
    },
    [onImageSelected],
  );

  if (preview) {
    return (
      <div ref={containerRef} className="relative">
        <img
          src={preview}
          alt="Загруженное изображение"
          className={cn(
            "w-full rounded-lg object-contain",
            compact ? "max-h-48" : "max-h-96",
          )}
        />
        {!isLoading && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
            <p className="text-sm font-medium text-white">Идёт поиск...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      tabIndex={0}
      role="button"
      aria-label="Загрузить изображение"
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        compact ? "p-6" : "p-12",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Upload
        className={cn(
          "text-muted-foreground mb-3",
          compact ? "h-8 w-8" : "h-12 w-12",
        )}
      />

      <p
        className={cn(
          "text-muted-foreground text-center font-medium",
          compact ? "text-sm" : "text-base",
        )}
      >
        Перетащите изображение сюда или нажмите для выбора
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ClipboardPaste className="h-3.5 w-3.5" />
        <span>Или вставьте из буфера обмена (Ctrl+V)</span>
      </div>

      <p className="text-muted-foreground mt-2 text-xs">
        JPG, PNG, WEBP — до 10 МБ
      </p>
    </div>
  );
};
