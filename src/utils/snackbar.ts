import {
  defaultErrorMessage,
  defaultSuccessMessage,
} from "@/config/labels/error";
import { IResponse } from "@/config/types";
import { useSnackbar } from "notistack";

export function useNotification() {
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (response: IResponse) => {
    const defaultMessage = response.success
      ? defaultSuccessMessage
      : defaultErrorMessage;

    enqueueSnackbar(response.message || defaultMessage, {
      variant: response.success ? "success" : "error",
    });
  };

  return { showNotification };
}
