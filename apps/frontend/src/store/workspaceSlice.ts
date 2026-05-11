import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WorkspaceState {
  activeProjectId: string | null;
}

const initialState: WorkspaceState = {
  activeProjectId: null,
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveProject(state, action: PayloadAction<string>) {
      state.activeProjectId = action.payload;
    },
    clearActiveProject(state) {
      state.activeProjectId = null;
    },
  },
});

export const { setActiveProject, clearActiveProject } = workspaceSlice.actions;
