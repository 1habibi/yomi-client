import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { Textarea } from "@/common/components/ui/textarea";

interface ModerationDialogProps {
  onReject: (reason: string) => void;
  isLoading?: boolean;
}

export function ModerationDialog({
  onReject,
  isLoading,
}: ModerationDialogProps) {
  const [open, setOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    if (rejectionReason.trim().length < 10) {
      return;
    }
    onReject(rejectionReason);
    setOpen(false);
    setRejectionReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          ❌ Отклонить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить рецензию</DialogTitle>
          <DialogDescription>
            Укажите причину отклонения. Автор увидит это сообщение.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Например: Рецензия содержит спойлеры без предупреждения..."
            minLength={10}
            maxLength={500}
            className="min-h-24"
          />
          <div className="text-muted-foreground text-sm">
            Минимум 10 символов. Осталось: {500 - rejectionReason.length}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false);
              setRejectionReason("");
            }}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={rejectionReason.trim().length < 10 || isLoading}
          >
            Отклонить рецензию
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
