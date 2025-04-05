// redux/features/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCityWeather } from '../../services/weatherApi';

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (cities, { rejectWithValue }) => {
    try {
      const promises = cities.map(city => fetchCityWeather(city));
      const results = await Promise.all(promises);
      return results.reduce((acc, result, index) => {
        acc[cities[index]] = result;
        return acc;
      }, {});
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default weatherSlice.reducer;