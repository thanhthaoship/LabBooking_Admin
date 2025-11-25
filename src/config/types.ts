export type Params = Promise<{ slug: string }>;
export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export const MAX_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CATEGORY_PAGE_SIZE = 5;
export const DEFAULT_MEDIA_PAGE_SIZE = 24;
