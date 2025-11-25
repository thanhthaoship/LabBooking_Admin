import HomePage from "@/pages-sections/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "CÔNG TY THIẾT BỊ VẬT TƯ NHA KHOA CÔNG BÌNH",
};

export default async function Page() {
  return <HomePage />;
}
