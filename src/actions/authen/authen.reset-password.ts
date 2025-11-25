import { API_ENDPOINTS } from "@/config/api.endpoint";
import { RequestResetPasswordRequest } from "@/config/schema/authen/authen.reset-password";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { IAuthenResponse, IResetPasswordRequest } from "./types";

export const requestResetPassword = async (
  request: RequestResetPasswordRequest
): Promise<IResponseWithData<IAuthenResponse>> => {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    {
      method: "POST",
      body: JSON.stringify(request),
      useNextApiUrl: false,
    }
  );

  return response;
};

export const resetPassword = async (
  request: IResetPasswordRequest
): Promise<IResponse> => {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    {
      method: "PUT",
      body: JSON.stringify(request),
      useNextApiUrl: false,
    }
  );

  return response;
};
