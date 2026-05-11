import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "./tasksApi";
import { workspaceApi } from "./workspaceApi";
import { workspaceSlice } from "./workspaceSlice";

export const store = configureStore({
  reducer: {
    [tasksApi.reducerPath]: tasksApi.reducer,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [workspaceSlice.name]: workspaceSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware).concat(workspaceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
