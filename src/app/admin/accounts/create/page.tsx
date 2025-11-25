import AccountForm from "@/components/admin/accounts/AccountForm";
import FormHeader from "@/components/common/FormHeader";
import { Box } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Admin Dashboard",
  description: "Create new user account",
};

export default function CreateAccountPage() {
  return (
    <Box py={4}>
      <FormHeader title="Thêm tài khoản mới" />
      <AccountForm />
    </Box>
  );
}
