import { API_ENDPOINTS } from "@/config/api.endpoint";
import {
  BasicSettingsModel,
  SiteSettingsModel,
  SocialSettingsModel,
} from "@/config/models/site-settings";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function saveBasicSettings(
  data: BasicSettingsModel
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.SITE_SETTINGS.BASIC, {
    method: "PUT",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export async function saveSocialSettings(
  data: SocialSettingsModel
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.SITE_SETTINGS.SOCIAL, {
    method: "PUT",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export default async function getSettings(): Promise<SiteSettingsModel> {
  const response = await enhancedFetch<IResponseWithData<SiteSettingsModel>>(
    API_ENDPOINTS.SITE_SETTINGS.INDEX,
    { useNextApiUrl: false }
  );
  return response.content || {};
}
