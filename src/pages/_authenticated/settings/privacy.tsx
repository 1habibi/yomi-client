import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { Label } from "@/common/components/ui/label";
import { Switch } from "@/common/components/ui/switch";
import { useUpdateUserSettings, useUserSettings } from "@/modules/profile";

export const Route = createFileRoute("/_authenticated/settings/privacy")({
  component: PrivacySettingsPage,
});

function PrivacySettingsPage() {
  const { data: settings, isLoading } = useUserSettings();
  const { mutate: updateSettings, isPending } = useUpdateUserSettings();

  const [formData, setFormData] = useState({
    lists_are_public: true,
    show_ratings_publicly: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        lists_are_public: settings.lists_are_public ?? true,
        show_ratings_publicly: settings.show_ratings_publicly ?? true,
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(
      { data: formData },
      {
        onSuccess: () => {
          toast.success("Настройки приватности сохранены");
        },
        onError: () => {
          toast.error("Ошибка при сохранении настроек");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Настройки приватности</h1>
      <p className="text-muted-foreground mb-6">
        Управляйте видимостью вашего профиля и активности
      </p>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Lists Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="lists_are_public">Публичные списки аниме</Label>
              <p className="text-muted-foreground text-sm">
                Другие пользователи смогут видеть ваши списки аниме
              </p>
            </div>
            <Switch
              id="lists_are_public"
              checked={formData.lists_are_public}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, lists_are_public: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="show_ratings_publicly">Публичные оценки</Label>
              <p className="text-muted-foreground text-sm">
                Другие пользователи смогут видеть ваши оценки аниме
              </p>
            </div>
            <Switch
              id="show_ratings_publicly"
              checked={formData.show_ratings_publicly}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, show_ratings_publicly: checked })
              }
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Дополнительные настройки приватности (видимость активности,
              сообщения, онлайн-статус) будут доступны после обновления бекенда.
            </p>
          </div>

          <div className="border-t pt-4">
            <Button onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить изменения
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
