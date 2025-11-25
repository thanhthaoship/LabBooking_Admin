import { API_ENDPOINTS } from "@/config/api.endpoint";
import { CreateAccountRequest } from "@/config/schema/account/account.schema";
import { IResponse } from "@/config/types";
import { getToken } from "@/session/token";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = await getToken();
  const body = (await request.json()) as CreateAccountRequest;
  const response = await enhancedFetch<IResponse>(API_ENDPOINTS.ACCOUNT.INDEX, {
    token,
    method: "POST",
    body: JSON.stringify(body),
    useNextApiUrl: false,
  });

  return NextResponse.json(response);
}
