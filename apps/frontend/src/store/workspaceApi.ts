"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  Team,
  Project,
  CreateTeamInput,
  UpdateTeamInput,
  CreateProjectInput,
  UpdateProjectInput,
} from "@todo/shared";
import { apiBaseQuery } from "./baseQuery";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Team", "Project"],
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], undefined>({
      query: () => "/teams",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Team" as const, id: _id })),
              { type: "Team", id: "LIST" },
            ]
          : [{ type: "Team", id: "LIST" }],
    }),

    createTeam: builder.mutation<Team, CreateTeamInput>({
      query: (body) => ({ url: "/teams", method: "POST", body }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),

    updateTeam: builder.mutation<Team, { id: string } & UpdateTeamInput>({
      query: ({ id, ...body }) => ({ url: `/teams/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Team", id }],
    }),

    deleteTeam: builder.mutation<undefined, string>({
      query: (id) => ({ url: `/teams/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Team", id },
        { type: "Team", id: "LIST" },
        { type: "Project", id: "LIST" },
      ],
    }),

    getProjects: builder.query<Project[], undefined>({
      query: () => "/projects",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Project" as const, id: _id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    createProject: builder.mutation<Project, CreateProjectInput>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    updateProject: builder.mutation<Project, { id: string } & UpdateProjectInput>({
      query: ({ id, ...body }) => ({ url: `/projects/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Project", id }],
    }),

    deleteProject: builder.mutation<undefined, string>({
      query: (id) => ({ url: `/projects/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = workspaceApi;
