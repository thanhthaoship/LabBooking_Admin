import { API_ENDPOINTS } from "@/config/api.endpoint";
import { SendCodeRequest } from "@/config/schema/authen/authen.otp";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export default async function sendCode(
  request: SendCodeRequest
): Promise<IResponse> {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.AUTH.SEND_CODE,
    {
      method: "POST",
      body: JSON.stringify(request),
      useNextApiUrl: false,
    }
  );

  return response;
}
