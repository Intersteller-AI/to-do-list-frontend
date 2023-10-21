// @ts-nocheck
import { configureStore } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { userReducers } from "./reducers/user";
import { taskReducers } from "./reducers/tasks";

const userInfoFromCookie = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : null;

const initialState = {
  user: {
    userInfo: userInfoFromCookie,
  },
  task: {
    activeTab: "To Do",
    taskData: {},
    modalOpen: false,
    status: "",
    isNew: false,
  },
};

const store = configureStore({
  reducer: {
    user: userReducers,
    task: taskReducers,
  },
  preloadedState: initialState,
});

export default store;
