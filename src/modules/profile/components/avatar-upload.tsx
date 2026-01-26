import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { useAuthContext } from "@/modules/auth";
import {
  useUsersControllerDeleteAvatar,
  useUsersControllerUploadAvatar,
} from "@/shared/api/generated/users/users";

interface AvatarUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/webp");
  });
}

type Step = "select" | "crop" | "preview";

export const AvatarUpload = ({ open, onOpenChange }: AvatarUploadProps) => {
  const { auth } = useAuthContext();
  const queryClient = useQueryClient();

  const uploadAvatar = useUsersControllerUploadAvatar({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      },
    },
  });

  const deleteAvatar = useUsersControllerDeleteAvatar({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      },
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("select");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Поддерживаются только форматы: JPG, PNG, WEBP");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Размер файла не должен превышать 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setStep("crop");
    };
    reader.readAsDataURL(file);
  };

  const handleCropNext = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedImage(croppedUrl);
      setStep("preview");
    } catch (err) {
      setError("Ошибка при обрезке изображения " + err);
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedBlob], "avatar.webp", {
        type: "image/webp",
      });

      await uploadAvatar.mutateAsync({ data: { file } });
      handleClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Ошибка загрузки файла",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAvatar.mutateAsync();
      handleClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Ошибка удаления аватара",
      );
    }
  };

  const handleClose = () => {
    setStep("select");
    setImageSrc(null);
    setCroppedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === "preview") {
      setStep("crop");
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage);
        setCroppedImage(null);
      }
    } else if (step === "crop") {
      setStep("select");
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Изменить аватар</DialogTitle>
          <DialogDescription>
            {step === "select" &&
              "Загрузите новый аватар. Поддерживаемые форматы: JPG, PNG, WEBP. Максимальный размер: 5MB."}
            {step === "crop" &&
              "Настройте область обрезки. Используйте колесико мыши или ползунок для масштабирования."}
            {step === "preview" &&
              "Проверьте результат перед загрузкой или вернитесь для корректировки."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {step === "select" && (
            <div className="border-border hover:border-primary flex h-96 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors">
              <label
                htmlFor="avatar-upload"
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <Upload className="text-muted-foreground h-12 w-12" />
                <span className="text-muted-foreground text-sm">
                  Нажмите для выбора файла
                </span>
              </label>
              <input
                id="avatar-upload"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}
          {step === "crop" && imageSrc && (
            <div className="space-y-4">
              <div className="relative h-96 w-full">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex items-center gap-4">
                <ZoomOut className="text-muted-foreground h-5 w-5" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
                <ZoomIn className="text-muted-foreground h-5 w-5" />
              </div>
            </div>
          )}

          {step === "preview" && croppedImage && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={croppedImage}
                  alt="Cropped preview"
                  className="h-64 w-64 rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === "select" && auth.user?.avatarUrl && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteAvatar.isPending}
            >
              {deleteAvatar.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить текущий
                </>
              )}
            </Button>
          )}

          {step !== "select" && (
            <Button variant="outline" onClick={handleBack}>
              Назад
            </Button>
          )}

          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>

          {step === "crop" && <Button onClick={handleCropNext}>Далее</Button>}

          {step === "preview" && (
            <Button onClick={handleUpload} disabled={uploadAvatar.isPending}>
              {uploadAvatar.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Загрузить
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
