import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchPassengers } from '@/api';
import Passenger from '@/types/Passenger';

interface PassengerState {
    data: Passenger[];
    filteredData: Passenger[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    page: number;
    limit: number;
    hasMoreData: boolean;
    countryFilter: string | null;
}

const initialState: PassengerState = {
    data: [],
    filteredData: [],
    status: 'idle',
    error: null,
    page: 0,
    limit: 10000,
    hasMoreData: true,
    countryFilter: null,
};

export const fetchPassengerData = createAsyncThunk(
    'passengers/fetchPassengerData',
    async (_, { getState }) => {
        const state = getState() as { passengers: PassengerState };
        const { page, limit } = state.passengers;
        const response = await fetchPassengers(page * limit, limit);
        return response;
    }
);

export const fetchMorePassengerData = createAsyncThunk(
    'passengers/fetchMorePassengerData',
    async (_, { getState }) => {
        const state = getState() as { passengers: PassengerState };
        const { page, limit } = state.passengers;

        if (!state.passengers.hasMoreData) return { data: [], newPage: page };

        const response = await fetchPassengers((page + 1) * limit, limit);

        if (!response || (Array.isArray(response) && response.length === 0)) {
            return { data: [], newPage: page, noMoreData: true };
        }

        if (!Array.isArray(response)) throw new Error(response?.message || 'Failed to fetch data.');

        return { data: response, newPage: page + 1 };
    }
);

const passengerSlice = createSlice({
    name: 'passengers',
    initialState,
    reducers: {
        setCountryFilter(state, action: PayloadAction<string | null>) {
            state.countryFilter = action.payload;
            state.filteredData = action.payload
                ? state.data.filter((passenger) => passenger.country_code === action.payload)
                : state.data;
        },
        clearCountryFilter(state) {
            state.countryFilter = null;
            state.filteredData = state.data;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPassengerData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPassengerData.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.status = 'succeeded';
                    state.data = action.payload;
                    state.filteredData = state.countryFilter
                        ? state.data.filter(
                              (passenger) => passenger.country_code === state.countryFilter
                          )
                        : state.data;
                } else {
                    state.status = 'failed';
                    state.error = action.payload?.message || 'Failed to fetch passenger data.';
                }
            })
            .addCase(fetchPassengerData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch passenger data';
            })
            .addCase(fetchMorePassengerData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMorePassengerData.fulfilled, (state, action) => {
                if (Array.isArray(action.payload?.data)) {
                    state.data = [...state.data, ...action.payload.data];
                    state.filteredData = state.countryFilter
                        ? state.data.filter(
                              (passenger) => passenger.country_code === state.countryFilter
                          )
                        : state.data;
                    state.page = action.payload.newPage;
                    state.hasMoreData = !action.payload.noMoreData;
                    state.status = 'succeeded';
                } else {
                    state.status = 'failed';
                    state.error = 'Failed to fetch more passenger data.';
                }
            })
            .addCase(fetchMorePassengerData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch more passenger data';
            });
    },
});

export const { setCountryFilter, clearCountryFilter } = passengerSlice.actions;
export default passengerSlice.reducer;
