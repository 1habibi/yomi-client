import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

import type { UserAnimeResponseDto, AddToListDtoListType } from "@/shared/api/generated/model";

import { useReorderList } from "../hooks/use-reorder-list";

import { SortableAnimeCard } from "./sortable-anime-card";

interface SortableAnimeListProps {
  animeList: UserAnimeResponseDto[];
  listType: AddToListDtoListType;
}

export function SortableAnimeList({
  animeList,
  listType,
}: SortableAnimeListProps) {
  const [items, setItems] = useState(animeList);
  const reorderList = useReorderList();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        reorderList.mutate({
          data: {
            list_type: listType,
            anime_ids: newOrder.map((item) => item.anime.id),
          },
        });

        return newOrder;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((anime) => (
            <SortableAnimeCard
              key={anime.id}
              anime={anime}
              listType={listType}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
