import { getToken } from "@/session/token";

export async function GET() {
  const token = await getToken();

  return Response.json({
    success: !!token,
  });
}
