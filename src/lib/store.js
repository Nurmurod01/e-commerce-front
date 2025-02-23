"use client";

import { configureStore } from "@reduxjs/toolkit";
import api from "./service/api";
import authReducer from "./slice/authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
