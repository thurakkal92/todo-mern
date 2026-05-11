"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import type { Task, CreateTaskInput, MoveTaskInput, UpdateTaskInput, ApiError } from "@todo/shared";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:4000";

const rawBaseQuery = fetchBaseQuery({ baseUrl: `${API_URL}/api` });

function isApiError(data: unknown): data is ApiError {
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

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
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

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery,
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], undefined>({
      query: () => "/tasks",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Task" as const, id: _id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    createTask: builder.mutation<Task, CreateTaskInput>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      // Pessimistic: wait for server confirmation before showing the new card.
      // The loading state drives the spinner; no ghost card is shown.
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<Task, { id: string; body: UpdateTaskInput }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),

    moveTask: builder.mutation<Task, { id: string; body: MoveTaskInput }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}/move`, method: "PATCH", body }),
      // True optimistic: update the cache immediately for instant drag-drop feedback.
      // On failure, undo rolls back to the last good state.
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          tasksApi.util.updateQueryData("getTasks", undefined, (draft) => {
            const task = draft.find((t) => t._id === id);
            if (task) {
              task.status = body.status;
              task.order = body.order;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      // Refetch after server confirms — picks up any rebalanced orders.
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    deleteTask: builder.mutation<undefined, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
