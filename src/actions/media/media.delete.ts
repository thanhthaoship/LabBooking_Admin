import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const deleteMedia = async (mediaIds: string[]) => {
  return await enhancedFetch<IResponse>(
    `${API_ENDPOINTS.MEDIA.DELETE_MULTIPLE}`,
    {
      method: "DELETE",
      useNextApiUrl: true,
      body: JSON.stringify(mediaIds),
    }
  );
};

export const deleteMultipleMedia = async (
  mediaIds: string[]
): Promise<IResponse> => {
  return await enhancedFetch(API_ENDPOINTS.MEDIA.DELETE_MULTIPLE, {
    method: "DELETE",
    body: JSON.stringify({ mediaIds }),
    useNextApiUrl: true,
  });
};
