export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
