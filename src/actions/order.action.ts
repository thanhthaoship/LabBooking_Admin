"use server";

import { API_ENDPOINTS } from "@/config/api.endpoint";
import { CreateOrderRequest } from "@/config/models/cart";
import { DiscountModel } from "@/config/models/discount";
import {
  CancelOrderRequest,
  CheckValidDiscountRequest,
  OrderModel,
  OrderRequest,
  UpdateOrderStatusRequest,
} from "@/config/models/order";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { sendCookies } from "./utils";

export async function checkValidDiscount(
  data: CheckValidDiscountRequest
): Promise<IResponseWithData<DiscountModel>> {
  return await enhancedFetch<IResponseWithData<DiscountModel>>(
    API_ENDPOINTS.ORDERS.CHECK_VALID_DISCOUNT,
    {
      method: "POST",
      body: JSON.stringify(data),
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
}
export async function submitOrder(
  data: CreateOrderRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.ORDERS.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
    headers: await sendCookies(),
  });
}

export async function getOrder(
  orderId: string
): Promise<OrderModel | undefined> {
  const res = await enhancedFetch<IResponseWithData<OrderModel>>(
    API_ENDPOINTS.ORDERS.DETAIL(orderId),
    {
      method: "GET",
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
  return res.content;
}

export async function updateOrderStatus(
  data: UpdateOrderStatusRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.ORDERS.UPDATE_STATUS(data.orderId),
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
}

export async function cancelOrder(
  data: CancelOrderRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.ORDERS.CANCEL(data.orderId),
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
}

export async function completeOrder(data: OrderRequest): Promise<IResponse> {
  // Note: later will be replaced with actual user id from next api
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.ORDERS.COMPLETE(data.orderId),
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
}
