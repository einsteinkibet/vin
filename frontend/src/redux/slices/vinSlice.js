import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vinAPI } from '../../../services/api';

export const decodeVIN = createAsyncThunk(
  'vin/decode',
  async (vin, { rejectWithValue }) => {
    try {
      const response = await vinAPI.decode(vin);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'VIN decoding failed');
    }
  }
);

const vinSlice = createSlice({
  name: 'vin',
  initialState: {
    currentVehicle: null,
    loading: false,
    error: null,
    history: [],
  },
  reducers: {
    clearVehicle: (state) => {
      state.currentVehicle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(decodeVIN.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decodeVIN.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(decodeVIN.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVehicle, clearError } = vinSlice.actions;
export default vinSlice.reducer;