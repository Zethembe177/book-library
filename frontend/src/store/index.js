// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./bookSlice";

export const store = configureStore({
  reducer: {
    books: bookReducer,
  },
});

export default store;
