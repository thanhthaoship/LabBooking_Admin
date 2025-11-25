import { getAccountDetails } from "@/actions/account.action";
import AccountForm from "@/components/admin/accounts/AccountForm";
import FormHeader from "@/components/common/FormHeader";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IParams {
  params: Promise<{ id: string }>;
}
export const metadata: Metadata = {
  title: "Update Account | Admin Dashboard",
  description: "Update user account details",
};

export default async function UpdateAccountPage({ params }: IParams) {
  const searchParams = await params;
  const account = await getAccountDetails(searchParams.id);

  if (!account) {
    notFound();
  }

  return (
    <Box py={4}>
      <FormHeader title="Cập nhật tài khoản" />
      <AccountForm initialValues={account} />
    </Box>
  );
}
