import { Bell } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";

import { useUnreadCount } from "../hooks/use-unread-count";

import { NotificationsDropdown } from "./notifications-dropdown";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { data } = useUnreadCount();

  const unreadCount = data?.count || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <NotificationsDropdown onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
