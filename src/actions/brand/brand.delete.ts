import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const deleteBrand = async (brandId: string) => {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.BRAND.DELETE(brandId), {
    method: "DELETE",
    useNextApiUrl: true,
  });
};
