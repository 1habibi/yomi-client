import { Loader2, Shield, ShieldOff } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/common/components/ui/alert-dialog";
import { Button } from "@/common/components/ui/button";

import { useBlock } from "../hooks/use-block";
import { useUnblock } from "../hooks/use-unblock";
import type { BlockButtonProps } from "../types";

export function BlockButton({
  userId,
  isBlocked: initialIsBlocked = false,
  onBlockChange,
}: BlockButtonProps) {
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [open, setOpen] = useState(false);
  const blockMutation = useBlock();
  const unblockMutation = useUnblock();

  const isLoading = blockMutation.isPending || unblockMutation.isPending;

  const handleBlock = async () => {
    try {
      await blockMutation.mutateAsync(userId);
      setIsBlocked(true);
      onBlockChange?.(true);
      setOpen(false);
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockMutation.mutateAsync(userId);
      setIsBlocked(false);
      onBlockChange?.(false);
    } catch (error) {
      console.error("Failed to unblock user:", error);
    }
  };

  if (isBlocked) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleUnblock}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShieldOff className="h-4 w-4" />
        )}
        Разблокировать
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <Shield className="h-4 w-4" />
          Заблокировать
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Заблокировать пользователя?</AlertDialogTitle>
          <AlertDialogDescription>
            Этот пользователь не сможет:
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Подписаться на вас</li>
              <li>Видеть вашу активность</li>
              <li>Отправлять вам сообщения</li>
            </ul>
            <p className="mt-3">Все взаимные подписки будут удалены.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleBlock} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Заблокировать
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
