import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import {
  CharacterResults,
  ImageUploadArea,
  useCharacterSearch,
} from "@/modules/character-search";

interface PlayerCharacterSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animeTitle?: string | null;
}

export function PlayerCharacterSearchModal({
  open,
  onOpenChange,
  animeTitle,
}: PlayerCharacterSearchModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const searchMutation = useCharacterSearch();

  const handleImageSelected = (file: File) => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));

    // Авто-поиск при вставке/загрузке с контекстом текущего аниме
    searchMutation.mutate({
      file,
      topK: 10,
      animeContext: animeTitle ?? undefined,
    });
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    searchMutation.reset();
  };

  // Сброс состояния при закрытии модалки
  useEffect(() => {
    if (!open) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      searchMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Кто этот персонаж?</DialogTitle>
          <DialogDescription>
            Сделайте скриншот кадра (Win+Shift+S) и вставьте сюда (Ctrl+V),
            или загрузите файл
          </DialogDescription>
        </DialogHeader>

        <ImageUploadArea
          onImageSelected={handleImageSelected}
          preview={preview}
          onClear={handleClear}
          isLoading={searchMutation.isPending}
          compact
        />

        {searchMutation.data && (
          <CharacterResults
            data={searchMutation.data}
            highlightAnime={animeTitle}
          />
        )}

        {searchMutation.error && (
          <p className="text-sm text-destructive">
            Ошибка поиска. Попробуйте другое изображение.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
