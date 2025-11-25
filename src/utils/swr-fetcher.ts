import { enhancedFetch, EnhancedFetchOptions } from "./enhanced-fetch";

export const swrFetcher = <T>(
  url: string,
  options: EnhancedFetchOptions = { method: "GET", useNextApiUrl: false }
) => enhancedFetch<T>(url, options);

export const swrNextFetcher = <T>(
  url: string,
  options: EnhancedFetchOptions = { method: "GET", useNextApiUrl: true }
) => enhancedFetch<T>(url, options);
