import { IResponse } from "@/config/types";
import { useNotification } from "@/utils/snackbar";
import { useRouter } from "next/navigation";

interface ActionHandlerOptions {
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export function useActionHandler() {
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleActionResult = async (
    response: IResponse,
    options?: ActionHandlerOptions
  ) => {
    showNotification(response);

    if (response.success) {
      if (options?.onSuccess) {
        options.onSuccess();
      }
      if (options?.redirectUrl) {
        router.push(options.redirectUrl);
      }
    } else if (options?.onError) {
      options.onError();
    }
  };

  return { handleActionResult };
}
