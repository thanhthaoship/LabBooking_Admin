import { API_ENDPOINTS } from "@/config/api.endpoint";
import { CreateProductRequest } from "@/config/schema/product/product.create";
import { UpdateProductRequest } from "@/config/schema/product/product.edit";
import { IResponse } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function createProduct(
  data: CreateProductRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.PRODUCT.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export async function updateProduct(
  data: UpdateProductRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.PRODUCT.UPDATE(data.productId),
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
    }
  );
}
