import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const uploadMedia = async (files: File[]): Promise<IResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  return await enhancedFetch<IResponse>(API_ENDPOINTS.MEDIA.UPLOAD, {
    method: "POST",
    body: formData,
    useNextApiUrl: true,
  });
};

export const uploadGoogleDriveMedia = async (
  files: File[]
): Promise<IResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  return await enhancedFetch<IResponse>(API_ENDPOINTS.MEDIA.GOOGLE_UPLOAD, {
    method: "POST",
    body: formData,
    useNextApiUrl: true,
  });
};
