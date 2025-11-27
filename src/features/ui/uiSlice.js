import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    taskModalOpen: false,
    editTaskId: null, 
  },
  reducers: {
    openTaskModal: (state, action) => {
      state.taskModalOpen = true;
      state.editTaskId = action.payload || null; 
    },
    closeTaskModal: (state) => {
      state.taskModalOpen = false;
      state.editTaskId = null;
    },
  },
});

export const { openTaskModal, closeTaskModal } = uiSlice.actions;
export default uiSlice.reducer;
