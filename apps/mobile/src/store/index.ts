import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import nearbyReducer from './slices/nearbySlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nearby: nearbyReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
