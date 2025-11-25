import { cookies } from "next/headers";

export const sendCookies = async (options?: HeadersInit) => {
  const cookieStore = await cookies();
  return {
    cookie: cookieStore.toString(),
    ...options,
  };
};
