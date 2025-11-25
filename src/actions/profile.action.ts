"use server";

import { API_ENDPOINTS } from "@/config/api.endpoint";
import { AccountModel } from "@/config/models/account";
import { IResponse, IResponseWithData } from "@/config/types";
import { UpdateProfileRequest } from "@/pages-sections/profile/UpdateProfile";
import { bodyString } from "@/utils/body-string";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { sendCookies } from "./utils";

export async function getProfile() {
  const response = await enhancedFetch<IResponseWithData<AccountModel>>(
    API_ENDPOINTS.USER.PROFILE.INDEX,
    {
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
  return response.content;
}

export async function updateProfile(request: UpdateProfileRequest) {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.USER.PROFILE.INDEX,
    {
      method: "PUT",
      useNextApiUrl: true,
      body: bodyString(request),
      headers: await sendCookies(),
    }
  );
  return response;
}

export async function getTotalPoints() {
  const response = await enhancedFetch<IResponseWithData<number>>(
    API_ENDPOINTS.USER.PROFILE.POINTS,
    {
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
  return response.content;
}
