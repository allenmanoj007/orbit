import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NearbyState {
  users: any[];
  isLoading: boolean;
  selectedFilter: string | null;
  radiusKm: number;
}

const initialState: NearbyState = {
  users: [],
  isLoading: false,
  selectedFilter: null,
  radiusKm: 10,
};

export const nearbySlice = createSlice({
  name: 'nearby',
  initialState,
  reducers: {
    setNearbyUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
      state.isLoading = false;
    },
    setNearbyLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRadiusKm: (state, action: PayloadAction<number>) => {
      state.radiusKm = action.payload;
    },
    setSelectedFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedFilter = action.payload;
    },
    updateUserConnectionStatus: (
      state,
      action: PayloadAction<{ userId: string; status: string }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        user.connectionStatus = action.payload.status;
      }
    },
  },
});

export const {
  setNearbyUsers,
  setNearbyLoading,
  setRadiusKm,
  setSelectedFilter,
  updateUserConnectionStatus,
} = nearbySlice.actions;

export default nearbySlice.reducer;
