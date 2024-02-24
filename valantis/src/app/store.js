import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "../features/componentName/apiSlice";

export default configureStore({
  reducer: {
    api: apiReducer,
  },
});
