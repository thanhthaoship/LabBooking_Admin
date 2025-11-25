import { AccountRoles } from "@/config/models/account";
import { REGEX } from "@/config/regex";
import * as z from "zod";

export const AccountSchema = z.object({
  fullname: z
    .string({ required_error: "Họ và tên là bắt buộc" })
    .min(1, "Họ và tên là bắt buộc"),
  phoneNumber: z
    .string({ required_error: "Số điện thoại là bắt buộc" })
    .regex(REGEX.PHONE_NUMBER, "Số điện thoại không hợp lệ"),
  password: z.string().optional(),
  isActive: z.boolean(),
  roleName: z.enum([AccountRoles.User, AccountRoles.Manager]),
  email: z
    .string()
    .email("Địa chỉ email không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  gender: z.boolean().optional(),
  dateOfBirth: z.date().optional().nullable(),
  totalPoints: z.number().min(0, { message: "Nhập số dương" }).optional(),
  totalSpin: z
    .number()
    .min(0, { message: "Nhập số dương" })
    .max(Number.MAX_SAFE_INTEGER, {
      message: `Nhập số nhỏ hơn ${Number.MAX_SAFE_INTEGER}`,
    })
    .optional(),
});

export const UpdateAccountSchame = AccountSchema.extend({
  id: z.string(),
});

export type CreateAccountRequest = z.infer<typeof AccountSchema>;
export type UpdateAccountRequest = z.infer<typeof UpdateAccountSchame>;
