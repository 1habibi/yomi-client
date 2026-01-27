import { useLocation } from "@tanstack/react-router";
import { MessageSquare, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/common/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Skeleton } from "@/common/components/ui/skeleton";
import { useAuthContext } from "@/modules/auth/hooks/use-auth-context";
import { CommentsControllerGetCommentsByAnimeSortBy } from "@/shared/api/generated/model";

import { useAnimeComments } from "../hooks/use-anime-comments";
import { useCreateComment } from "../hooks/use-create-comment";
import { useDeleteComment } from "../hooks/use-delete-comment";
import { useLikeComment } from "../hooks/use-like-comment";
// import { useReportComment } from "../hooks/use-report-comment"; // TODO: Implement report functionality
import { useUpdateComment } from "../hooks/use-update-comment";

import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentsSectionProps {
  animeId: number;
}

export function CommentsSection({ animeId }: CommentsSectionProps) {
  // Текущая страница
  const [page, setPage] = useState(1);

  // Сортировка
  const [sortBy, setSortBy] =
    useState<CommentsControllerGetCommentsByAnimeSortBy>(
      CommentsControllerGetCommentsByAnimeSortBy.newest,
    );

  // Роутер
  const location = useLocation();
  const { auth } = useAuthContext();

  // Перезагрузка только если на первой странице и сортировка по новым
  const enablePolling =
    page === 1 && sortBy === CommentsControllerGetCommentsByAnimeSortBy.newest;

  // Загрузка комментариев
  const { data, isLoading } = useAnimeComments(
    animeId,
    page,
    sortBy,
    enablePolling,
  );

  const createComment = useCreateComment();
  const updateComment = useUpdateComment(animeId);
  const deleteComment = useDeleteComment(animeId);
  const likeComment = useLikeComment(animeId);

  // Refs для отслеживания состояния
  const scrolledHashRef = useRef<string | null>(null);
  const previousTotalRef = useRef<number>(0);
  const previousCommentIdsRef = useRef<Set<number>>(new Set());

  const [newCommentsCount, setNewCommentsCount] = useState(0);
  const [showNewCommentsBar, setShowNewCommentsBar] = useState(false);

  const highlightComments = (commentIds: number[], delay = 300) => {
    setTimeout(() => {
      commentIds.forEach((commentId) => {
        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
          element.classList.add("ring-2", "ring-primary", "ring-offset-2");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-primary", "ring-offset-2");
          }, 2000);
        }
      });
    }, delay);
  };

  useEffect(() => {
    setNewCommentsCount(0);
    setShowNewCommentsBar(false);
    if (data?.pagination?.total) {
      previousTotalRef.current = data.pagination.total;
    }
    if (data?.data) {
      previousCommentIdsRef.current = new Set(data.data.map((c) => c.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy]);

  // Обработка новых комментариев
  useEffect(() => {
    if (!isLoading && data && enablePolling && data.pagination) {
      const currentTotal = data.pagination.total;
      if (previousTotalRef.current === 0) {
        previousTotalRef.current = currentTotal;
        if (data.data) {
          previousCommentIdsRef.current = new Set(data.data.map((c) => c.id));
        }
        return;
      }
      const newCount = currentTotal - previousTotalRef.current;
      if (newCount > 0) {
        setNewCommentsCount(newCount);
        setShowNewCommentsBar(true);
      }
    }
  }, [data, isLoading, enablePolling]);

  const handleShowNewComments = () => {
    if (!data?.pagination || !data?.data) return;

    const currentCommentIds = new Set(data.data.map((c) => c.id));
    const newCommentIds = Array.from(currentCommentIds).filter(
      (id) => !previousCommentIdsRef.current.has(id),
    );

    previousTotalRef.current = data.pagination.total;
    previousCommentIdsRef.current = currentCommentIds;
    setNewCommentsCount(0);
    setShowNewCommentsBar(false);

    if (newCommentIds.length > 0) {
      const firstElement = document.getElementById(
        `comment-${newCommentIds[0]}`,
      );
      if (firstElement) {
        firstElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      highlightComments(newCommentIds);
    }
  };

  useEffect(() => {
    if (scrolledHashRef.current && scrolledHashRef.current !== location.hash) {
      scrolledHashRef.current = null;
    }
  }, [location.hash]);

  useEffect(() => {
    if (
      !isLoading &&
      data &&
      location.hash &&
      scrolledHashRef.current !== location.hash
    ) {
      const elementId = location.hash.startsWith("#")
        ? location.hash.substring(1)
        : location.hash;

      const scrollToComment = (attempt: number = 0) => {
        const element = document.getElementById(elementId);

        if (element) {
          scrolledHashRef.current = location.hash;

          requestAnimationFrame(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            const commentId = parseInt(elementId.replace("comment-", ""));
            if (!isNaN(commentId)) {
              highlightComments([commentId], 0);
            }
          });
        } else if (attempt < 10) {
          setTimeout(() => scrollToComment(attempt + 1), 200);
        }
      };

      setTimeout(() => scrollToComment(), 300);
    }
  }, [isLoading, data, location.hash]);

  const handleCreateComment = (content: string) => {
    createComment.mutate(
      {
        animeId,
        data: { content },
      },
      {
        onSuccess: () => {
          if (data?.pagination?.total !== undefined) {
            previousTotalRef.current = data.pagination.total + 1;
          }
        },
      },
    );
  };

  const handleReply = (parentId: number, content: string) => {
    createComment.mutate(
      {
        animeId,
        data: {
          content,
          parent_id: parentId,
        },
      },
      {
        onSuccess: () => {
          if (data?.pagination?.total !== undefined) {
            previousTotalRef.current = data.pagination.total + 1;
          }
        },
      },
    );
  };

  const handleEdit = (commentId: number, content: string) => {
    updateComment.mutate({
      id: commentId,
      data: { content },
    });
  };

  const handleDelete = (commentId: number) => {
    if (confirm("Вы уверены, что хотите удалить этот комментарий?")) {
      deleteComment.mutate({ id: commentId });
    }
  };

  const handleLike = (commentId: number, isLike: boolean) => {
    likeComment.mutate({
      id: commentId,
      data: { is_like: isLike },
    });
  };

  const handleReport = (commentId: number) => {
    // TODO: Открыть диалог с выбором причины
    console.log("Report comment:", commentId);
  };

  const totalPages = data?.pagination?.total_pages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <MessageSquare className="h-6 w-6" />
          Комментарии
          {data?.pagination?.total !== undefined && (
            <span className="text-muted-foreground">
              ({data.pagination.total})
            </span>
          )}
        </h2>

        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as CommentsControllerGetCommentsByAnimeSortBy)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value={CommentsControllerGetCommentsByAnimeSortBy.newest}
            >
              Новые
            </SelectItem>
            <SelectItem
              value={CommentsControllerGetCommentsByAnimeSortBy.popular}
            >
              Популярные
            </SelectItem>
            <SelectItem
              value={CommentsControllerGetCommentsByAnimeSortBy.oldest}
            >
              Старые
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {auth.user ? (
        <Card className="p-4">
          <CommentForm
            onSubmit={handleCreateComment}
            placeholder="Поделитесь своим мнением об этом аниме..."
            isLoading={createComment.isPending}
          />
        </Card>
      ) : (
        <Card className="text-muted-foreground p-4 text-center">
          Войдите, чтобы оставить комментарий
        </Card>
      )}

      {showNewCommentsBar && newCommentsCount > 0 && (
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
          onClick={handleShowNewComments}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {newCommentsCount}{" "}
          {newCommentsCount === 1
            ? "новый комментарий"
            : newCommentsCount < 5
              ? "новых комментария"
              : "новых комментариев"}
        </Button>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="space-y-4">
          {data.data.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={auth.user?.id}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleLike}
              onReport={handleReport}
              isLoading={
                createComment.isPending ||
                updateComment.isPending ||
                deleteComment.isPending ||
                likeComment.isPending
              }
            />
          ))}
        </div>
      ) : (
        <Card className="text-muted-foreground p-8 text-center">
          Пока нет комментариев. Будьте первым!
        </Card>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={page === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
