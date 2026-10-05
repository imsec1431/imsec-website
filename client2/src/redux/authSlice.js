import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // No user logged in by default
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // Set user data
    },
    logout: (state) => {
      state.user = null; // Clear user data
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
