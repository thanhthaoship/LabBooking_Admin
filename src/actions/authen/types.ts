import { IUserIdResponse } from "@/config/types";

export interface IAuthenResponse extends IUserIdResponse {
  accessToken: string;
}

export interface IResetPasswordRequest {
  userId: string;
  newPassword: string;
}
