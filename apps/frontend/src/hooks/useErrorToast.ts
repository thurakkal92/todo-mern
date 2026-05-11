"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { ApiError } from "@todo/shared";

/**
 * Fires a toast.error whenever `error` becomes non-null.
 * Uses the error code as the toast ID so duplicate codes are deduplicated.
 */
export function useErrorToast(error: ApiError | undefined | null): void {
  useEffect(() => {
    if (!error) return;
    toast.error(error.error.message, {
      id: error.error.code,
    });
  }, [error]);
}
