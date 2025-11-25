import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IResponse } from "@/config/types";
import { getToken } from "@/session/token";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { toQueryString } from "@/utils/query-string";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = await getToken();
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  const response = await enhancedFetch<IResponse>(
    `${API_ENDPOINTS.ACCOUNT.FILTER}?${toQueryString(params)}`,
    {
      token,
      method: "GET",
      useNextApiUrl: false,
    }
  );

  return NextResponse.json(response);
}
