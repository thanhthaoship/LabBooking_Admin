import { API_ENDPOINTS } from "@/config/api.endpoint";
import {} from "@/config/models/blog";
import {
  CreateLuckyWheelRequest,
  LuckyWheel,
  LuckyWheelPrize,
  UpdateLuckyWheelRequest,
} from "@/config/schema/lucky-wheel/lucky-wheel.schema";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function getAllLuckWheels(): Promise<LuckyWheel[] | undefined> {
  const response = await enhancedFetch<IResponseWithData<LuckyWheel[]>>(
    API_ENDPOINTS.LUCKY_WHEEL.INDEX,
    { useNextApiUrl: false }
  );
  return response.content ?? [];
}

export async function fakeSpinTheWheel(
  wheelId: string
): Promise<IResponseWithData<LuckyWheelPrize>> {
  const response = await enhancedFetch<IResponseWithData<LuckyWheelPrize>>(
    API_ENDPOINTS.LUCKY_WHEEL.FAKE_SPIN(wheelId),
    { useNextApiUrl: false }
  );
  return response;
}

export async function spinTheWheel(
  wheelId: string,
  userId: string
): Promise<IResponseWithData<LuckyWheelPrize>> {
  const response = await enhancedFetch<IResponseWithData<LuckyWheelPrize>>(
    API_ENDPOINTS.LUCKY_WHEEL.SPIN(wheelId, userId),
    { useNextApiUrl: false }
  );
  return response;
}

export async function getLuckyWheelById(
  id: string
): Promise<LuckyWheel | undefined> {
  const response = await enhancedFetch<IResponseWithData<LuckyWheel>>(
    API_ENDPOINTS.LUCKY_WHEEL.DETAIL(id),
    { useNextApiUrl: false }
  );
  return response.content;
}

export async function getActiveLuckyWheel(): Promise<LuckyWheel | undefined> {
  const response = await enhancedFetch<IResponseWithData<LuckyWheel>>(
    API_ENDPOINTS.LUCKY_WHEEL.ACTIVE,
    { useNextApiUrl: false }
  );
  return response.content;
}

export async function createLuckyWheel(
  data: CreateLuckyWheelRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.LUCKY_WHEEL.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export async function editLuckyWheel(
  data: UpdateLuckyWheelRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.LUCKY_WHEEL.UPDATE(data.luckyWheelId),
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
    }
  );
}

export async function deleteLuckyWheel(blogId: string): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.BLOG.DELETE(blogId), {
    method: "DELETE",
    useNextApiUrl: true,
  });
}
