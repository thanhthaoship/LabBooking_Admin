import { API_ENDPOINTS } from "@/config/api.endpoint";
import {
  ISavePointRulesRequest,
  PointRuleModel,
} from "@/config/models/point-rule";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function savePointRules(
  data: ISavePointRulesRequest
): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.POINT_RULES.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export default async function getPointRules(): Promise<PointRuleModel[]> {
  const response = await enhancedFetch<IResponseWithData<PointRuleModel[]>>(
    API_ENDPOINTS.POINT_RULES.INDEX,
    { useNextApiUrl: false }
  );
  return response.content || [];
}
