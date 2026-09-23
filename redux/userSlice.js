import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUserData, setLoading, setError, clearUser } =
  userSlice.actions;

export default userSlice.reducer;
