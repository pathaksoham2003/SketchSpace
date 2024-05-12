import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    chat: false,
    color: { h: 214, s: 43, v: 90, a: 1 },
    size: 3,
  },
  reducers: {
    setValues: (state, action) => {
      action.payload.key === "chat"
        ? (state[action.payload.key] = !state[action.payload.key])
        : (state[action.payload.key] = action.payload.value);
    },
  },
});

export const selectChat = (state) => state.user.chat;

export const { setValues } = userSlice.actions;

export default userSlice.reducer;
