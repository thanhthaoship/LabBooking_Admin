import { API_ENDPOINTS } from "@/config/api.endpoint";
import { UpdateBrandRequest } from "@/config/schema/brand/brand.update";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const updateBrand = async (data: UpdateBrandRequest) => {
  return await enhancedFetch<IResponse>(
    `${API_ENDPOINTS.BRAND.INDEX}/${data.brandId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
    }
  );
};