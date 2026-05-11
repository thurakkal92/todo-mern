import type { ApiError } from "@todo/shared";

export function isApiError(e: unknown): e is ApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "error" in e &&
    typeof (e as ApiError).error === "object" &&
    typeof (e as ApiError).error.code === "string"
  );
}
