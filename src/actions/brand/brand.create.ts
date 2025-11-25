import { API_ENDPOINTS } from "@/config/api.endpoint";
import { CreateBrandRequest } from "@/config/schema/brand/brand.create";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const createBrand = async (data: CreateBrandRequest) => {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.BRAND.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
};