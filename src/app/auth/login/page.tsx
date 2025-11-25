import Login from "@/pages-sections/Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào tài khoản của bạn",
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
