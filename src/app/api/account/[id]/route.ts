import { API_ENDPOINTS } from "@/config/api.endpoint";
import { CreateAccountRequest } from "@/config/schema/account/account.schema";
import { IResponse } from "@/config/types";
import { getToken } from "@/session/token";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const token = await getToken();
  const { id } = params;
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.ACCOUNT.DETAIL(id),
    {
      token,
      method: "GET",
      useNextApiUrl: false,
    }
  );

  return NextResponse.json(response);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = await getToken();
  const body = (await request.json()) as CreateAccountRequest;
  const { id } = params;

  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.ACCOUNT.UPDATE(id),
    {
      token,
      method: "PUT",
      body: JSON.stringify(body),
      useNextApiUrl: false,
    }
  );

  return NextResponse.json(response);
}
