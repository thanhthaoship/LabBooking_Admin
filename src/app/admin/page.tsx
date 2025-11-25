"use client";

import { FlexBox } from "@/components/flex-box";
import { ADMIN_ROUTES } from "@/config/routes";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(ADMIN_ROUTES.DASHBOARD);
  }, []);

  return (
    <FlexBox justifyContent={"center"} mt={5}>
      <CircularProgress />
    </FlexBox>
  );
};

export default Page;
