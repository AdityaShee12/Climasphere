import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import layoutReducer from "../features/layoutSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    layout: layoutReducer,
  },
});
