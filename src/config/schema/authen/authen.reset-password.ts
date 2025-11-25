import * as zod from "zod";
import { REGEX } from "../../regex";

export const RequestResetPasswordSchema = zod.object({
  phoneNumber: zod
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .regex(REGEX.PHONE_NUMBER, "Số điện thoại không hợp lệ"),
});

export type RequestResetPasswordRequest = zod.infer<
  typeof RequestResetPasswordSchema
>;

export const ResetPasswordSchema = zod
  .object({
    userId: zod.string({ required_error: "Vui lòng nhập mã người dùng" }),
    password: zod
      .string({ required_error: "Vui lòng nhập mật khẩu" })
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(REGEX.UPPER_CASE, "Mật khẩu phải chứa ít nhất 1 chữ in hoa")
      .regex(REGEX.LOWER_CASE, "Mật khẩu phải chứa ít nhất 1 chữ thường")
      .regex(REGEX.NUMBER, "Mật khẩu phải chứa ít nhất 1 số")
      .regex(REGEX.SPECIAL_CHAR, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
    re_password: zod
      .string({ required_error: "Vui lòng nhập lại mật khẩu" })
      .min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.re_password, {
    message: "Mật khẩu không khớp",
    path: ["re_password"],
  });

export type ResetPasswordFormValues = zod.infer<typeof ResetPasswordSchema>;
