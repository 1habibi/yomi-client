/**
 * Общие типы для API слоя
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

/**
 * Типы для конфигурации запросов
 */
export interface RequestConfig extends Omit<RequestInit, "body"> {
  params?: Record<string, unknown>;
  body?: unknown;
  includeCredentials?: boolean;
}
