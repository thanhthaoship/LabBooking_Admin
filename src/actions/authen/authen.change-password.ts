import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export interface ChangePasswordModel {
  phoneNumber: string;
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(
  data: ChangePasswordModel
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
    method: "PUT",
    body: JSON.stringify(data),
    useNextApiUrl: false,
  });
}
