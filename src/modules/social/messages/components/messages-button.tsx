import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Button } from "@/common/components/ui/button";

import { useUnreadCount } from "../hooks/use-unread-count";

export function MessagesButton() {
  const { unreadCount } = useUnreadCount();

  return (
    <Link to="/messages">
      <Button variant="ghost" size="icon" className="relative">
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
