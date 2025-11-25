import { getSession } from ".";

export async function getToken(): Promise<string | undefined> {
  const session = await getSession();
  return session.token;
}
