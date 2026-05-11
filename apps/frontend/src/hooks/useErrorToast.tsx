"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { ApiError } from "@todo/shared";
import { ToastCard } from "@/components/atoms/ToastCard";

export function useErrorToast(error: ApiError | undefined | null): void {
  useEffect(() => {
    if (!error) return;
    toast.custom(() => <ToastCard variant="error" title={error.error.message} />, {
      id: error.error.code,
    });
  }, [error]);
}
