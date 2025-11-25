import { Role } from "../types";

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email?: string;
  avatar?: string;
}
