import ResetPassword from "@/pages-sections/authen/ResetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Nhập mật khẩu mới của bạn",
};

const ResetPasswordPage = async () => {
  return <ResetPassword />;
};

export default ResetPasswordPage;
