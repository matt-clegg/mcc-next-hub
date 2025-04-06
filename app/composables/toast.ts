export function useErrorToast(title: string, description?: string) {
  createToast({
    title,
    description,
    icon: "i-lucide-circle-alert",
    color: "error"
  });
}

export function useSuccessToast(title: string, description?: string) {
  createToast({
    title,
    description,
    icon: "i-lucide-circle-check-big",
    color: "success"
  });
}

export function useInfoToast(title: string, description?: string) {
  createToast({
    title,
    description,
    icon: "i-lucide-info",
    color: "info"
  });
}

export type ToastOptions = {
  title: string;
  description?: string;
  icon?: string;
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral";
};

export function createToast(options: ToastOptions) {
  const toast = useToast();
  toast.add(options);
}
