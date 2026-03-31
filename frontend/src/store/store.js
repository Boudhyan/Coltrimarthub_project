import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Authslice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
