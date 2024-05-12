import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../redux/toogleSlice";

export const store = configureStore({
    reducer:{
        user:userReducer,
    }
})