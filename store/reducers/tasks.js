// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const taskInitialState = {
  // activeTab: "Dashboard",
  activeTab: "To Do",
  taskData: {},
  modalOpen: false,
  status: "",
  isNew: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState: taskInitialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setTaskData: (state, action) => {
      state.taskData = action.payload;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setIsNew: (state, action) => {
      state.isNew = action.payload;
    },
  },
});

const taskActions = taskSlice.actions;
const taskReducers = taskSlice.reducer;

export { taskActions, taskReducers };
