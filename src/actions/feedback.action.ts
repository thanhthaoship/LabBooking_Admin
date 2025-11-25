import { API_ENDPOINTS } from "@/config/api.endpoint";
import {
  CreateFeedbackModel,
  FeedbackModel,
  UpdateFeedbackModel,
} from "@/config/models/feedback";
import { IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function getAllFeedbacks() {
  const response = await enhancedFetch<IResponseWithData<FeedbackModel[]>>(
    API_ENDPOINTS.FEEDBACK.INDEX,
    {
      method: "GET",
      useNextApiUrl: false,
    }
  );
  return response.content || [];
}

export async function getAllFeedbacksByProduct(productId: string) {
  const response = await enhancedFetch<IResponseWithData<FeedbackModel[]>>(
    API_ENDPOINTS.FEEDBACK.PRODUCT(productId),
    {
      method: "GET",
      useNextApiUrl: false,
    }
  );
  return response.content || [];
}

export async function getFeedbackById(id: string) {
  const response = await enhancedFetch<IResponseWithData<FeedbackModel>>(
    `${API_ENDPOINTS.FEEDBACK.INDEX}/${id}`,
    {
      method: "GET",
      useNextApiUrl: false,
    }
  );
  return response;
}

export async function createFeedback(data: CreateFeedbackModel) {
  const response = await enhancedFetch<IResponse>(
    API_ENDPOINTS.FEEDBACK.INDEX,
    {
      method: "POST",
      body: JSON.stringify(data),
      useNextApiUrl: false,
    }
  );
  return response;
}

export async function updateFeedback(id: string, data: UpdateFeedbackModel) {
  const response = await enhancedFetch<IResponse>(
    `${API_ENDPOINTS.FEEDBACK.INDEX}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: false,
    }
  );
  return response;
}

export async function deleteFeedback(id: string) {
  const response = await enhancedFetch<IResponse>(
    `${API_ENDPOINTS.FEEDBACK.INDEX}/${id}`,
    {
      method: "DELETE",
      useNextApiUrl: false,
    }
  );
  return response;
}

// Add this function to your feedback actions
export const getTopFeedbacks = async () => {
  const response = await enhancedFetch(`${API_ENDPOINTS.FEEDBACK}/top`, {
    method: "GET",
    useNextApiUrl: false,
  });
  return response;
};
