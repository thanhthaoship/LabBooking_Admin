import * as zod from "zod";
import { REGEX } from "../../regex";

export const LoginSchema = zod.object({
  password: zod.string({ required_error: "Vui lòng nhập mật khẩu" }),
  phoneNumber: zod
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .regex(REGEX.PHONE_NUMBER, "Số điện thoại không hợp lệ"),
});

export type LoginRequest = zod.infer<typeof LoginSchema>;
