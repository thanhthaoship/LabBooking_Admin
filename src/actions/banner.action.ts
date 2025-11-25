import { API_ENDPOINTS } from "@/config/api.endpoint";
import { SaveBannerRequest } from "@/pages-sections/admin/settings/BannerSettingsForm";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { BannerModel } from "@/config/models/banner";

export async function saveBanners(
  data: SaveBannerRequest[]
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.BANNER.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export default async function getAllBanners(): Promise<BannerModel[]> {
  const response = await enhancedFetch<IResponseWithData<BannerModel[]>>(
    API_ENDPOINTS.BANNER.INDEX,
    { useNextApiUrl: false }
  );
  return response.content ?? [];
}
