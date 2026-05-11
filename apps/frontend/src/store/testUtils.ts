import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "./tasksApi";

export function setupTestStore() {
  return configureStore({
    reducer: { [tasksApi.reducerPath]: tasksApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tasksApi.middleware),
  });
}

export type TestStore = ReturnType<typeof setupTestStore>;
