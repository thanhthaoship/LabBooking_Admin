import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export default async function checkIsLoggedIn(): Promise<IResponse> {
  const response = await enhancedFetch<IResponse>(API_ENDPOINTS.AUTH.INDEX, {
    method: "GET",
    useNextApiUrl: false,
  });
  return response;
}
