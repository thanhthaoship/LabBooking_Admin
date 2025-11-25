import { API_ENDPOINTS } from "@/config/api.endpoint";
import { VerifyCodeRequest } from "@/config/schema/authen/authen.otp";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export default async function verifyCode(
  request: VerifyCodeRequest
): Promise<IResponse> {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.AUTH.VERIFY_CODE,
    {
      method: "POST",
      body: JSON.stringify(request),
      useNextApiUrl: false,
    }
  );
  return response;
}
