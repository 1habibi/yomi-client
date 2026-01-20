import { AlertTriangle, Loader2 } from "lucide-react";
import React from "react";

import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";

/**
 * Компонент состояния загрузки с скелетонами
 */
export const LoadingState = React.memo(() => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Skeleton className="mb-4 h-8 w-64" />
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2 text-center">
                <Skeleton className="mx-auto h-8 w-16" />
                <Skeleton className="mx-auto h-4 w-20" />
              </div>
            </Card>
          ))}
        </div>
        <Card className="mb-6 p-6">
          <div className="mb-4 flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-36" />
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
});

LoadingState.displayName = "LoadingState";

/**
 * Компонент состояния ошибки
 */
export const ErrorState = React.memo<{ error: Error | { message: string } }>(
  ({ error }) => {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center p-8">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Ошибка загрузки данных:</strong> {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  },
);

ErrorState.displayName = "ErrorState";

/**
 * Компонент спиннера загрузки
 */
export const LoadingSpinner = React.memo<{ text?: string }>(
  ({ text = "Загрузка..." }) => {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{text}</span>
        </div>
      </div>
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";
