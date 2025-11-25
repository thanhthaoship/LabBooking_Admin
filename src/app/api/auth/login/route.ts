import { IAuthenResponse } from "@/actions/authen/types";
import { API_ENDPOINTS } from "@/config/api.endpoint";
import { LoginRequest } from "@/config/schema/authen/authen.login";
import { IResponseWithData } from "@/config/types";
import { createSession } from "@/session";
import { decodeToken, getHomePageUrlByRole } from "@/utils/auth";
import { enhancedFetch } from "@/utils/enhanced-fetch";

export async function POST(request: Request): Promise<Response> {
  const loginData: LoginRequest = await request.json();

  // Call .NET backend API
  const res = await enhancedFetch<IResponseWithData<IAuthenResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      method: "POST",
      body: JSON.stringify(loginData),
      useNextApiUrl: false,
    }
  );
  // Create session if login successful
  if (res.success && res.content?.accessToken) {
    const user = decodeToken(res.content.accessToken);
    if (!user)
      return Response.json({
        success: false,
      });

    const homePage = getHomePageUrlByRole(user.role);

    // Store session using iron-session
    await createSession(res.content.accessToken, user);

    return Response.json({
      ...res,
      redirectTo: homePage,
    });
  }

  return Response.json(res);
}
