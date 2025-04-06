export function useErrorToast(title: string, description?: string) {
  createIcon({
    title,
    description,
    icon: "i-lucide-circle-alert",
    color: "error"
  });
}

export function useSuccessToast(title: string, description?: string) {
  createIcon({
    title,
    description,
    icon: "i-lucide-circle-check-big",
    color: "success"
  });
}

export function useInfoToast(title: string, description?: string) {
  createIcon({
    title,
    description,
    icon: "i-lucide-info",
    color: "info"
  });
}

type ToastOptions = {
  title: string;
  description?: string;
  icon?: string;
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral";
};

function createIcon(options: ToastOptions) {
  const toast = useToast();
  toast.add(options);
}
