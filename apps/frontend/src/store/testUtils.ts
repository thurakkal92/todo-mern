import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "./tasksApi";
import { workspaceApi } from "./workspaceApi";
import { workspaceSlice } from "./workspaceSlice";

export function setupTestStore() {
  return configureStore({
    reducer: {
      [tasksApi.reducerPath]: tasksApi.reducer,
      [workspaceApi.reducerPath]: workspaceApi.reducer,
      [workspaceSlice.name]: workspaceSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(tasksApi.middleware).concat(workspaceApi.middleware),
  });
}

export type TestStore = ReturnType<typeof setupTestStore>;
