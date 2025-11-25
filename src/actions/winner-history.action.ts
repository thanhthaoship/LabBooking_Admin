import { API_ENDPOINTS } from "@/config/api.endpoint";
import { UpdateWinnerModel } from "@/config/models/winner-history.model";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function updateWinnerStatus(
  data: UpdateWinnerModel
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.WINNER_HISTORY.UPDATE, {
    method: "PUT",
    body: JSON.stringify(data),
    useNextApiUrl: false,
  });
}
