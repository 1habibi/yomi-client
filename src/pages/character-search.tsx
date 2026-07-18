import { createFileRoute } from "@tanstack/react-router";
import { ScanSearch } from "lucide-react";
import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  CharacterResults,
  ImageUploadArea,
  useCharacterSearch,
  useMultiCharacterSearch,
} from "@/modules/character-search";

function CharacterSearchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"single" | "multi">("multi");

  const singleSearch = useCharacterSearch();
  const multiSearch = useMultiCharacterSearch();

  const isSearching = singleSearch.isPending || multiSearch.isPending;
  const hasResults = !!singleSearch.data || !!multiSearch.data;

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    singleSearch.reset();
    multiSearch.reset();
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    singleSearch.reset();
    multiSearch.reset();
  };

  const handleSearch = () => {
    if (!selectedFile) return;
    if (mode === "single") {
      singleSearch.mutate({ file: selectedFile, topK: 20 });
    } else {
      multiSearch.mutate({ file: selectedFile });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <ScanSearch className="text-primary h-8 w-8" />
          <h1 className="text-4xl font-bold">Поиск персонажа</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Загрузите скриншот или изображение — ИИ определит персонажа и аниме
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Загрузите изображение</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadArea
            onImageSelected={handleImageSelected}
            preview={preview}
            onClear={handleClear}
            isLoading={isSearching}
          />

          {selectedFile && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Переключатель режима поиска */}
              <div className="flex overflow-hidden rounded-lg border">
                <button
                  type="button"
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    mode === "multi"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setMode("multi")}
                >
                  Несколько персонажей
                </button>
                <button
                  type="button"
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    mode === "single"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setMode("single")}
                >
                  Один персонаж
                </button>
              </div>

              <Button onClick={handleSearch} disabled={isSearching}>
                <ScanSearch className="mr-2 h-4 w-4" />
                {isSearching ? "Поиск..." : "Найти персонажа"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Результаты */}
      {hasResults && (
        <CharacterResults
          data={singleSearch.data ?? null}
          multiData={multiSearch.data ?? null}
        />
      )}

      {/* Ошибка */}
      {(singleSearch.error || multiSearch.error) && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">
              Ошибка поиска. Убедитесь что AI-сервис доступен и попробуйте
              снова.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const Route = createFileRoute("/character-search")({
  component: CharacterSearchPage,
  head: () => ({
    title: "Поиск персонажа по изображению - Yomi",
    meta: [
      {
        name: "description",
        content:
          "Определите аниме-персонажа по скриншоту или изображению с помощью AI",
      },
    ],
  }),
});
