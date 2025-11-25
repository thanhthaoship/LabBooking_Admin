import { User } from "@/config/models/user";

export interface SessionData {
  token?: string;
  user?: User;
}
