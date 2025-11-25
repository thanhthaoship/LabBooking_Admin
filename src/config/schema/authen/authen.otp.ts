import * as zod from "zod";
import { REGEX } from "../../regex";

export const VerifyCodeSchema = zod.object({
  code: zod
    .string({ required_error: "Vui lòng nhập mã OTP" })
    .regex(REGEX.OTP, "Mã OTP phải là 6 chữ số"),
  userId: zod
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .regex(REGEX.PHONE_NUMBER, "Số điện thoại không hợp lệ"),
});

export type VerifyCodeRequest = zod.infer<typeof VerifyCodeSchema>;

export const SendCodeSchema = zod.object({
  userId: zod.string().uuid(),
});

export type SendCodeRequest = zod.infer<typeof SendCodeSchema>;
