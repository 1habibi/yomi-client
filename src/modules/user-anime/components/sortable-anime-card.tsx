import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import type { UserAnimeResponseDto, AddToListDtoListType } from "@/shared/api/generated/model";

import { AnimeListCard } from "./anime-list-card";

interface SortableAnimeCardProps {
  anime: UserAnimeResponseDto;
  listType: AddToListDtoListType;
}

export function SortableAnimeCard({ anime, listType }: SortableAnimeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: anime.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="text-muted-foreground hover:text-foreground h-6 w-6" />
      </div>
      <AnimeListCard data={anime} listType={listType} />
    </div>
  );
}
