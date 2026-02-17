import { useState } from "react";

import { Skeleton } from "@/common/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import {
  AddToListDtoListType,
  type UserAnimeResponseDto,
} from "@/shared/api/generated/model";

import { useMyLists } from "../hooks/use-my-lists";
import { LIST_NAMES } from "../utils/list-validation";

import { AnimeListCard } from "./anime-list-card";
import { SortableAnimeList } from "./sortable-anime-list";


export function MyAnimeLists() {
  const [activeTab, setActiveTab] = useState<string>(
    AddToListDtoListType.WATCHING,
  );
  const [sortMode, setSortMode] = useState<
    "date" | "rating" | "title" | "custom"
  >("custom");
  const { data, isLoading } = useMyLists(sortMode);

  const tabs = [
    {
      value: AddToListDtoListType.WATCHING,
      label: LIST_NAMES[AddToListDtoListType.WATCHING],
    },
    {
      value: AddToListDtoListType.WATCHED,
      label: LIST_NAMES[AddToListDtoListType.WATCHED],
    },
    {
      value: AddToListDtoListType.PLANNED,
      label: LIST_NAMES[AddToListDtoListType.PLANNED],
    },
    {
      value: AddToListDtoListType.DROPPED,
      label: LIST_NAMES[AddToListDtoListType.DROPPED],
    },
    {
      value: AddToListDtoListType.FAVORITE,
      label: LIST_NAMES[AddToListDtoListType.FAVORITE],
    },
    {
      value: AddToListDtoListType.RECOMMENDED,
      label: LIST_NAMES[AddToListDtoListType.RECOMMENDED],
    },
    {
      value: AddToListDtoListType.DISLIKED,
      label: LIST_NAMES[AddToListDtoListType.DISLIKED],
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const getListByType = (type: string) => {
    const key = type.toLowerCase() as keyof typeof data;
    return data?.[key] || [];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Мои списки</h2>
        <select
          value={sortMode}
          onChange={(e) =>
            setSortMode(
              e.target.value as "date" | "rating" | "title" | "custom",
            )
          }
          className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="custom">Ручная сортировка</option>
          <option value="date">По дате</option>
          <option value="rating">По оценке</option>
          <option value="title">По названию</option>
        </select>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          {tabs.map((tab) => {
            const count =
              data?.stats?.[
                tab.value.toLowerCase() as keyof typeof data.stats
              ] || 0;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs"
              >
                {tab.label}
                {typeof count === "number" && count > 0 && (
                  <span className="bg-primary/10 ml-1 rounded px-1.5 py-0.5 text-xs font-medium">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((tab) => {
          const animeList = getListByType(tab.value);

          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {animeList.length > 0 ? (
                sortMode === "custom" ? (
                  <SortableAnimeList
                    animeList={animeList}
                    listType={tab.value as AddToListDtoListType}
                  />
                ) : (
                  <div className="space-y-2">
                    {animeList.map((anime: UserAnimeResponseDto) => (
                      <AnimeListCard
                        key={anime.id}
                        data={anime}
                        listType={tab.value}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-muted-foreground rounded-lg border border-dashed py-12 text-center text-sm">
                  В этом списке пока нет аниме
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
