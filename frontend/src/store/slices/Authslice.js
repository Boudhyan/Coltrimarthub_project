import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null || JSON.parse(localStorage.getItem("token")),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token } = action.payload;
      state.token = access_token;
      state.isAuthenticated = true;
      localStorage.setItem("token", JSON.stringify(access_token));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
