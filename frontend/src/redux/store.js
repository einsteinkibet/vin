import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import vinSlice from './slices/vinSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    vin: vinSlice,
  },
});

export default store;