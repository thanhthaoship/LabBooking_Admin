import { API_ENDPOINTS } from "@/config/api.endpoint";
import {
  BlogModel,
  CreateBlogModel,
  UpdateBlogModel,
} from "@/config/models/blog";
import { IPagedResult, IResponse, IResponseWithData } from "@/config/types";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export default async function getBlogById(
  blogId: string
): Promise<BlogModel | undefined> {
  const response = await enhancedFetch<IResponseWithData<BlogModel>>(
    API_ENDPOINTS.BLOG.DETAIL(blogId),
    { useNextApiUrl: false }
  );
  return response.content;
}

export async function getRelatedBlogs(): Promise<BlogModel[]> {
  const response = await enhancedFetch<
    IResponseWithData<IPagedResult<BlogModel>>
  >(`${API_ENDPOINTS.BLOG.FILTER}?pageSize=4`, { useNextApiUrl: false });
  return response.content?.items || [];
}

export async function createBlog(data: CreateBlogModel): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.BLOG.INDEX, {
    method: "POST",
    body: JSON.stringify(data),
    useNextApiUrl: true,
  });
}

export async function editBlog(data: UpdateBlogModel): Promise<IResponse> {
  return await enhancedFetch<IResponse>(
    API_ENDPOINTS.BLOG.UPDATE(data.blogId),
    {
      method: "PUT",
      body: JSON.stringify(data),
      useNextApiUrl: true,
    }
  );
}

export async function deleteBlog(blogId: string): Promise<IResponse> {
  return await enhancedFetch<IResponse>(API_ENDPOINTS.BLOG.DELETE(blogId), {
    method: "DELETE",
    useNextApiUrl: true,
  });
}
