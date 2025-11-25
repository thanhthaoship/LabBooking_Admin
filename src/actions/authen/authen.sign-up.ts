import { API_ENDPOINTS } from "@/config/api.endpoint";
import { SignupRequest } from "@/config/schema/authen/authen.signup";
import { IResponseWithData, IUserIdResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export default async function signup(
  request: SignupRequest
): Promise<IResponseWithData<IUserIdResponse>> {
  const response = await enhancedFetch<IResponseWithData<IUserIdResponse>>(
    API_ENDPOINTS.AUTH.SIGN_UP,
    {
      method: "POST",
      body: JSON.stringify(request),
      useNextApiUrl: false,
    }
  );

  return response;
}
