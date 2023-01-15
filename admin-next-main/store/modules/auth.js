import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  remember: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload?.user;
      state.token = action.payload?.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    rememberLogin: (state, action) => {
      state.remember = action.payload;
    },
  },
});

export const { login, logout, rememberLogin } = authSlice.actions;
export default authSlice.reducer;
