import { API_ENDPOINTS } from "@/config/api.endpoint";
import { LoginRequest } from "@/config/schema/authen/authen.login";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { IAuthenResponse } from "./types";

export default async function login(
  request: LoginRequest
): Promise<IResponseWithData<IAuthenResponse>> {
  const response = await enhancedFetch<IResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify(request),
    useNextApiUrl: true,
  });

  return response;
}
