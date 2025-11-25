import { useSnackbar } from "notistack";

export function useNotification() {
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (response: any) => {
    enqueueSnackbar(response.message, {
      variant: response.success ? "success" : "error",
    });
  };

  return { showNotification };
}
