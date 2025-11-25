import AccountListView from "@/pages-sections/admin/accounts/AccountListView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Management | Admin Dashboard",
  description: "Manage user accounts and permissions",
};

export default function AccountListPage() {
  return <AccountListView />;
}
