"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import type { Task, CreateTaskInput, MoveTaskInput, UpdateTaskInput } from "@todo/shared";
import { apiBaseQuery } from "./baseQuery";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    // arg is projectId or undefined (home view = all tasks)
    getTasks: builder.query<Task[], string | undefined>({
      query: (projectId) => (projectId ? `/tasks?projectId=${projectId}` : "/tasks"),
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
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<Task, { id: string; body: UpdateTaskInput }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),

    moveTask: builder.mutation<Task, { id: string; body: MoveTaskInput; projectId?: string }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}/move`, method: "PATCH", body }),
      // Optimistic update targets the same cache entry the board is reading from.
      async onQueryStarted({ id, body, projectId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          tasksApi.util.updateQueryData("getTasks", projectId, (draft) => {
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
