import { SortDirection } from "./table/types";

export type Params = Promise<{ slug: string }>;
export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export interface IDefaultSearchParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface ILoadingProps {
  loading: boolean;
  setLoading?: (value: boolean) => void;
  handleMutate?: () => void;
}

export interface IProductsByCategoryProps {
  categoryId: string;
  title: string;
  subTitle: string;
}

export type Role = "Admin" | "User" | "Manager";

export interface IResponse {
  success: boolean;
  message?: string;
  code?: string;
  redirectTo?: string;
}

export interface IResponseWithData<T> extends IResponse {
  content?: T;
}

export interface IUserIdResponse {
  userId: string;
}

export interface IUserIdRequest {
  userId: string;
}

export interface IPagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export interface IFilterRequest {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export const MAX_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CATEGORY_PAGE_SIZE = 5;
export const DEFAULT_MEDIA_PAGE_SIZE = 24;
