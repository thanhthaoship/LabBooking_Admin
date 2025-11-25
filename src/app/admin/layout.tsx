"use client";

import VendorDashboardLayout from "@/components/layouts/vendor-dashboard";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return <VendorDashboardLayout>{children}</VendorDashboardLayout>;
}
