import { API_ENDPOINTS } from "@/config/api.endpoint";
import { BankSettingsModel } from "@/config/models/site-settings";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function saveBankSettings(
  data: BankSettingsModel
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.PAYMENT.INDEX, {
    method: "PUT",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export default async function getBankSettings(): Promise<
  BankSettingsModel | undefined
> {
  const response = await enhancedFetch<IResponseWithData<BankSettingsModel>>(
    API_ENDPOINTS.PAYMENT.INDEX,
    { useNextApiUrl: false }
  );
  return response.content;
}
