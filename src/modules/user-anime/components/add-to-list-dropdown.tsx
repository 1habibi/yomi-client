import { Check, Plus, X } from "lucide-react";

import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import type { AddToListDtoListType } from "@/shared/api/generated/model";

import { useAddToList } from "../hooks/use-add-to-list";
import { useAnimeStatus } from "../hooks/use-anime-status";
import { useRemoveFromList } from "../hooks/use-remove-from-list";
import {
  LIST_ICONS,
  LIST_NAMES,
  PRIMARY_STATUSES,
  SECONDARY_FLAGS,
} from "../utils/list-validation";

interface AddToListDropdownProps {
  animeId: number;
}

export function AddToListDropdown({ animeId }: AddToListDropdownProps) {
  const { data: status } = useAnimeStatus(animeId);
  const addToList = useAddToList();
  const removeFromList = useRemoveFromList();

  const isInList = (type: AddToListDtoListType): boolean => {
    return status?.list_types?.includes(type) ?? false;
  };

  const handleClick = (listType: AddToListDtoListType) => {
    const isPrimary = PRIMARY_STATUSES.includes(listType);
    const alreadyInList = isInList(listType);

    if (isPrimary) {
      addToList.mutate({
        data: {
          anime_id: animeId,
          list_type: listType,
        },
      });
    } else {
      if (alreadyInList) {
        removeFromList.mutate({
          animeId,
          listType,
        });
      } else {
        addToList.mutate({
          data: {
            anime_id: animeId,
            list_type: listType,
          },
        });
      }
    }
  };

  const primaryLists = PRIMARY_STATUSES.map((type) => ({
    type,
    label: LIST_NAMES[type],
    icon: LIST_ICONS[type],
  }));

  const secondaryLists = SECONDARY_FLAGS.map((type) => ({
    type,
    label: LIST_NAMES[type],
    icon: LIST_ICONS[type],
  }));

  const listsCount = status?.list_types?.length ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {listsCount > 0 ? `В списках (${listsCount})` : "Добавить в список"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {primaryLists.map((list) => (
          <DropdownMenuItem
            key={list.type}
            onSelect={(e) => {
              e.preventDefault();
              handleClick(list.type);
            }}
          >
            <span className="mr-2">{list.icon}</span>
            <span className="flex-1">{list.label}</span>
            {isInList(list.type) && (
              <Check className="text-primary ml-2 h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
          Дополнительно
        </div>
        {secondaryLists.map((list) => {
          const inList = isInList(list.type);
          return (
            <DropdownMenuItem
              key={list.type}
              onSelect={(e) => {
                e.preventDefault();
                handleClick(list.type);
              }}
            >
              <span className="mr-2">{list.icon}</span>
              <span className="flex-1">{list.label}</span>
              {inList ? (
                <X className="text-destructive ml-2 h-4 w-4" />
              ) : (
                <Plus className="text-muted-foreground ml-2 h-4 w-4" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
