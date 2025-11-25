import { API_ENDPOINTS } from "@/config/api.endpoint";
import {
  CreateDiscountCodeModel,
  DiscountCodeModel,
  UpdateDiscountCodeModel,
} from "@/config/models/discount";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export const getDiscount = async (id: string) => {
  const response = await enhancedFetch<IResponseWithData<DiscountCodeModel>>(
    API_ENDPOINTS.DISCOUNT.DETAIL(id),
    {
      method: "GET",
      useNextApiUrl: false,
    }
  );
  return response.content;
};

export const createDiscount = async (data: CreateDiscountCodeModel) => {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.DISCOUNT.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
};

export const updateDiscount = async (data: UpdateDiscountCodeModel) => {
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.DISCOUNT.UPDATE(data.discountId),
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
    }
  );
};

export const deleteDiscount = async (id: string) => {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.DISCOUNT.DELETE(id), {
    method: "DELETE",
    useNextApiUrl: true,
  });
};
