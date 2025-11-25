"use client";

import Loading from "@/components/Loading";
import Cookies from "js-cookie";

export default async function LogOutPage() {
  Cookies.remove("_session", { path: "/" });
  return <Loading />;
}
