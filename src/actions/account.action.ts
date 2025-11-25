"use server";

import { API_ENDPOINTS } from "@/config/api.endpoint";
import { AccountModel } from "@/config/models/account";
import {
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/config/schema/account/account.schema";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { sendCookies } from "./utils";

export async function getAccountDetails(id: string) {
  const response = await enhancedFetch<IResponseWithData<AccountModel>>(
    API_ENDPOINTS.ACCOUNT.DETAIL(id),
    {
      method: "GET",
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );

  return response.content;
}

export async function createAccount(data: CreateAccountRequest) {
  const response = await enhancedFetch<IResponse>(API_ENDPOINTS.ACCOUNT.INDEX, {
    method: "POST",
    useNextApiUrl: true,
    body: JSON.stringify(data),
    headers: await sendCookies(),
  });

  return response;
}

export async function updateAccount(data: UpdateAccountRequest) {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.ACCOUNT.UPDATE(data.id),
    {
      method: "PUT",
      useNextApiUrl: true,
      body: JSON.stringify(data),
      headers: await sendCookies(),
    }
  );

  return response;
}
