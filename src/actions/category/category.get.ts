import { API_ENDPOINTS } from "@/config/api.endpoint";
import { CategoryModel } from "@/config/models/category";
import { IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const getCategoryById = async (id: string) => {
  const response = await enhancedFetch<IResponseWithData<CategoryModel>>(
    API_ENDPOINTS.CATEGORY.DETAIL(id),
    {
      useNextApiUrl: false,
    }
  );

  return response.content;
};
