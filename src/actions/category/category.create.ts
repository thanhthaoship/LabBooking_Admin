import { API_ENDPOINTS } from "@/config/api.endpoint";
import { CreateCategoryRequest } from "@/config/schema/category/category.create";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const createCategory = async (data: CreateCategoryRequest) => {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.CATEGORY.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
};
