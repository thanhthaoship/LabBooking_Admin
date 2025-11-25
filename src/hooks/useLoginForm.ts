import { login } from "@/actions/authen";
import { COMMON_ROUTES } from "@/config/routes";
import { LoginRequest, LoginSchema } from "@/config/schema/authen/authen.login";
import { useVerification } from "@/contexts/VerificationContext";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { toFormikValidationSchema } from "zod-formik-adapter";

type ResponseCode = "REQUIRE_OTP";

export const useLoginForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setUserId, setRedirectTo } = useVerification();
  const router = useRouter();

  const handleFormSubmit = async (values: LoginRequest) => {
    const response = await login({
      phoneNumber: values.phoneNumber,
      password: values.password,
    });

    if (!response.success) {
      enqueueSnackbar(response.message, {
        variant: "error",
      });
      return;
    }

    if ((response.code as ResponseCode) === "REQUIRE_OTP") {
      setUserId(response.content?.userId!);
      setRedirectTo(COMMON_ROUTES.AUTH.LOGIN);
      router.push(COMMON_ROUTES.AUTH.VERIFY_OTP);
      return;
    }

    // Redirect based on user role
    router.push(response.redirectTo ?? COMMON_ROUTES.UNAUTHORIZED);

    enqueueSnackbar(response.message, {
      variant: "success",
    });
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
    },
    onSubmit: handleFormSubmit,
    validationSchema: toFormikValidationSchema(LoginSchema),
  });

  return formik;
};
