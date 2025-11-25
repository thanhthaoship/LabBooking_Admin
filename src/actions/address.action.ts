"use server";

import { API_ENDPOINTS } from "@/config/api.endpoint";
import {
  CreateShippingAddressModel,
  ShippingAddressModel,
  UpdateShippingAddressModel,
} from "@/config/models/shipping-address";
import { IResponse, IResponseWithData } from "@/config/types";
import { bodyString } from "@/utils/body-string";
import { enhancedFetch } from "@/utils/enhanced-fetch";
import { sendCookies } from "./utils";

export async function getAddresses() {
  const response = await enhancedFetch<
    IResponseWithData<ShippingAddressModel[]>
  >(API_ENDPOINTS.USER.ADDRESS.INDEX, {
    useNextApiUrl: true,
    headers: await sendCookies(),
  });
  return response.content;
}

export async function getAddressById(shipAddressId: string) {
  const response = await enhancedFetch<IResponseWithData<ShippingAddressModel>>(
    API_ENDPOINTS.USER.ADDRESS.DETAILS(shipAddressId),
    {
      useNextApiUrl: false,
      headers: await sendCookies(),
    }
  );
  return response.content;
}

export async function createAddress(request: CreateShippingAddressModel) {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.USER.ADDRESS.INDEX,
    {
      method: "POST",
      useNextApiUrl: true,
      body: bodyString(request),
      headers: await sendCookies(),
    }
  );
  return response;
}

export async function updateAddress(request: UpdateShippingAddressModel) {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.USER.ADDRESS.UPDATE(request.shippingAddressId),
    {
      method: "PUT",
      useNextApiUrl: true,
      body: bodyString(request),
      headers: await sendCookies(),
    }
  );
  return response;
}

export async function deleteAddress(shipAddressId: string) {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.USER.ADDRESS.DELETE(shipAddressId),
    {
      method: "DELETE",
      useNextApiUrl: true,
      headers: await sendCookies(),
    }
  );
  return response;
}
