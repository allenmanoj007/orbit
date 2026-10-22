import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; accessToken: string; refreshToken?: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isLoading = false;

      SecureStore.setItemAsync('orbit_access_token', action.payload.accessToken);
      if (action.payload.refreshToken) {
        SecureStore.setItemAsync('orbit_refresh_token', action.payload.refreshToken);
      }
    },
    updateUserProfile: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user.profile = { ...state.user.profile, ...action.payload };
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;

      SecureStore.deleteItemAsync('orbit_access_token');
      SecureStore.deleteItemAsync('orbit_refresh_token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateUserProfile, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
