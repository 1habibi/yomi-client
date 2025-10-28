import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationData {
  page: number;
  total_pages: number;
  total: number;
  has_prev: boolean;
  has_next: boolean;
}

interface AnimePaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const AnimePagination: React.FC<AnimePaginationProps> = ({
  pagination,
  currentPage,
  onPageChange,
  onNext,
  onPrev,
}) => {
  if (pagination.total_pages <= 1) return null;

  const getVisiblePages = () => {
    const totalPages = pagination.total_pages;
    const current = pagination.page;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={onPrev}
              className={pagination.has_prev ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
            />
          </PaginationItem>

          {visiblePages.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => onPageChange(pageNum)}
                isActive={pageNum === currentPage}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={onNext}
              className={pagination.has_next ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="text-center text-sm text-muted-foreground">
        Страница {pagination.page} из {pagination.total_pages} • Всего:{" "}
        {pagination.total.toLocaleString()} аниме
      </div>
    </div>
  );
};
