import { SWRConfiguration } from "swr";

export const swrOptions: SWRConfiguration = {
  revalidateOnFocus: false, // Disable automatic revalidation on window focus
  revalidateIfStale: false, // Disable automatic revalidation of stale data
  dedupingInterval: 5000, // Dedupe similar requests within 5 seconds
  keepPreviousData: true, // Keep showing previous data while fetching new data
};
