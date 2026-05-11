import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useErrorToast } from "../useErrorToast";
import type { ApiError } from "@todo/shared";

vi.mock("sonner", () => ({
  toast: { custom: vi.fn() },
}));

vi.mock("@/components/atoms/ToastCard", () => ({
  ToastCard: () => null,
}));

describe("useErrorToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when error is undefined", async () => {
    const { toast } = await import("sonner");
    renderHook(() => {
      useErrorToast(undefined);
    });
    expect(toast.custom).not.toHaveBeenCalled();
  });

  it("fires toast.custom with the error code as id", async () => {
    const { toast } = await import("sonner");
    const error: ApiError = {
      error: { code: "NOT_FOUND", message: "Task not found" },
    };
    renderHook(() => {
      useErrorToast(error);
    });
    expect(toast.custom).toHaveBeenCalledWith(expect.any(Function), { id: "NOT_FOUND" });
  });

  it("uses error code as toast id for deduplication", async () => {
    const { toast } = await import("sonner");
    const error: ApiError = {
      error: { code: "VALIDATION_ERROR", message: "Validation failed" },
    };
    renderHook(() => {
      useErrorToast(error);
    });
    expect(toast.custom).toHaveBeenCalledWith(expect.any(Function), { id: "VALIDATION_ERROR" });
  });

  it("does not fire again for the same error reference", async () => {
    const { toast } = await import("sonner");
    const error: ApiError = { error: { code: "ERR", message: "oops" } };
    const { rerender } = renderHook(() => {
      useErrorToast(error);
    });
    rerender();
    expect(toast.custom).toHaveBeenCalledTimes(1);
  });
});
