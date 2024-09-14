import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: { username?: string };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string }>) {
      state.isAuthenticated = true;
      state.user.username = action.payload.username;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = {};
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
