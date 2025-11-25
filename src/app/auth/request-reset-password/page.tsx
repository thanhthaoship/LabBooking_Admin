import RequestResetPassword from "@/pages-sections/authen/RequestResetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cấp lại mật khẩu",
  description: "Nhập số điện thoại của bạn",
};

const ResetPasswordPage = () => {
  return <RequestResetPassword />;
};

export default ResetPasswordPage;
