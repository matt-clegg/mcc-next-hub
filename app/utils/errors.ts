import { FetchError } from "ofetch";
import { fromZodIssue } from "zod-validation-error";

export function handleFetchError(error: unknown) {
  if (error instanceof FetchError) {
    if (error.statusMessage === "Validation Error") {
      const firstIssue = error.data.data.issues[0];
      const validationError = fromZodIssue(firstIssue);
      useErrorToast(validationError.toString());
    }
    else {
      useErrorToast(error.data.message ?? "Something went wrong");
    }
  }
  else {
    useErrorToast("Something went wrong", error instanceof Error ? error.message : undefined);
  }
}
