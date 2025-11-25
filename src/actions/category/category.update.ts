import { API_ENDPOINTS } from "@/config/api.endpoint";
import { UpdateCategoryRequest } from "@/config/schema/category/category.update";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const updateCategory = async (data: UpdateCategoryRequest) => {
  return await enhancedFetch<IResponse>(
    `${API_ENDPOINTS.CATEGORY.INDEX}/${data.categoryId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
    }
  );
};
