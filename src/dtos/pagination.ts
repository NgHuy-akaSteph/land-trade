export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field?: string;
  order?: SortOrder;
}

export interface FilterOptions {
  search?: string;
  searchFields?: String[];
  [key: string]: any; // Cho phép filter động theo các trường khác
}


export interface PaginationOptions {
  page?: number;
  limit?: number;
  sorts?: SortOptions[];
  filters?: FilterOptions;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sorts?: SortOptions[];
  filters?: FilterOptions;
}
