"use client";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import type { ApiError } from "@todo/shared";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:4000";

const rawBaseQuery = fetchBaseQuery({ baseUrl: `${API_URL}/api` });

export function isApiError(data: unknown): data is ApiError {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as ApiError).error === "object" &&
    typeof (data as ApiError).error.code === "string"
  );
}

function networkApiError(status: string | number): ApiError {
  return {
    error: {
      code: "NETWORK_ERROR",
      message:
        status === "FETCH_ERROR"
          ? "Network error — check your connection"
          : "An unexpected error occurred",
    },
  };
}

export const apiBaseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error) {
    const { data, status } = result.error;
    return { error: isApiError(data) ? data : networkApiError(status) };
  }
  return result;
};
