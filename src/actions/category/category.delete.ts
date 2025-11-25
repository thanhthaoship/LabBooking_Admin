import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const deleteCategory = async (categoryId: string) => {
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.CATEGORY.DELETE(categoryId),
    {
      method: "DELETE",
      useNextApiUrl: true,
    }
  );
};
