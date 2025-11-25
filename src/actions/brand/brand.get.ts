import { API_ENDPOINTS } from "@/config/api.endpoint";
import { BrandModel } from "@/config/models/brand";
import { IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const getBrandById = async (brandId: string) => {
  const response = await enhancedFetch<IResponseWithData<BrandModel>>(
    API_ENDPOINTS.BRAND.DETAIL(brandId),
    {
      useNextApiUrl: false,
    }
  );
  return response.content;
};
