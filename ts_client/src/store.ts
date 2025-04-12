import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from "./slices/BoardSlice.js";

const store = configureStore({
  reducer: {
    whiteboard: whiteboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
