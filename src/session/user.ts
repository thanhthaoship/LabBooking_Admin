import { User } from "@/config/models/user";
import { getSession } from ".";

export async function getUser(): Promise<User | undefined> {
  const session = await getSession();
  return session.user;
}
