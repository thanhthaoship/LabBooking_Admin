"use server";

import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { sendCookies } from "./utils";

export async function getUserId(): Promise<string | undefined> {
  const response = await enhancedFetch<IResponseWithData<string>>(
    API_ENDPOINTS.USER.ID,
    {
      method: "GET",
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );

  return response.content;
}
