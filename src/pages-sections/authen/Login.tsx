"use client";

import { FlexBox, FlexRowCenter } from "@/components/flex-box";
import { COMMON_ROUTES } from "@/config/routes";
import { useLoginForm } from "@/hooks/useLoginForm";
import BazaarTextField from "@components/BazaarTextField";
import { H1, H6 } from "@components/Typography";
import { Box, Button } from "@mui/material";
import Link from "next/link";

const Login = () => {
  const {
    values,
    errors,
    isSubmitting,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <>
      <form onSubmit={handleSubmit}>
        <H1 textAlign="center" mt={2} mb={4} fontSize={20}>
          Đăng nhập
        </H1>

        <BazaarTextField
          mb={1.5}
          fullWidth
          name="phoneNumber"
          size="small"
          type="text"
          autoComplete="tel"
          variant="outlined"
          onBlur={handleBlur}
          value={values.phoneNumber}
          onChange={handleChange}
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          error={!!touched.phoneNumber && !!errors.phoneNumber}
          helperText={touched.phoneNumber && errors.phoneNumber}
        />

        <BazaarTextField
          mb={2}
          fullWidth
          size="small"
          name="password"
          label="Mật khẩu"
          autoComplete="on"
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          placeholder="*********"
          type={"password"}
          error={!!touched.password && !!errors.password}
          helperText={touched.password && errors.password}
        />

        <Button
          disabled={isSubmitting}
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          sx={{
            height: 44,
          }}
        >
          Đăng nhập
        </Button>
      </form>

      <FlexRowCenter mt="1.25rem">
        <Box>Chưa có tài khoản?</Box>
        <Link href={COMMON_ROUTES.AUTH.SIGNUP}>
          <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
            Đăng ký
          </H6>
        </Link>
      </FlexRowCenter>

      <FlexBox
        justifyContent="center"
        bgcolor="grey.200"
        borderRadius="4px"
        py={2.5}
        mt="1.25rem"
      >
        Quên mật khẩu?
        <Link href={COMMON_ROUTES.AUTH.REQUEST_RESET_PASSWORD}>
          <H6 ml={1} borderBottom="1px solid" borderColor="grey.900">
            Cài đặt lại mật khẩu
          </H6>
        </Link>
      </FlexBox>
    </>
  );
};

export default Login;
