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

// Fetch initial passenger data
export const fetchPassengerData = createAsyncThunk<
    Passenger[],
    void,
    { rejectValue: { message: string } }
>('passengers/fetchPassengerData', async (_, { rejectWithValue }) => {
    try {
        const response = await fetchPassengers(0, initialState.limit);
        if (!response || (response as Passenger[]).length === 0) {
            return rejectWithValue({ message: 'No data found' });
        }
        return response;
    } catch (error: any) {
        return rejectWithValue({ message: error.message || 'Failed to fetch passenger data' });
    }
});

// Fetch more passenger data (pagination)
export const fetchMorePassengerData = createAsyncThunk<
    { data: Passenger[]; newPage: number; noMoreData: boolean },
    void,
    { rejectValue: { message: string } }
>('passengers/fetchMorePassengerData', async (_, { getState, rejectWithValue }) => {
    const state = getState() as { passengers: PassengerState };
    const { page, limit, hasMoreData } = state.passengers;

    if (!hasMoreData) {
        return { data: [], newPage: page, noMoreData: true };
    }

    try {
        const response = await fetchPassengers((page + 1) * limit, limit);

        if (!response || (response as Passenger[]).length === 0) {
            return { data: [], newPage: page, noMoreData: true };
        }

        return {
            data: response,
            newPage: page + 1,
            noMoreData: (response as Passenger[]).length < limit,
        };
    } catch (error: any) {
        return rejectWithValue({ message: error.message || 'Failed to fetch more passenger data' });
    }
});

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
            // Fetch initial data
            .addCase(fetchPassengerData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPassengerData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.filteredData = state.countryFilter
                    ? state.data.filter(
                          (passenger) => passenger.country_code === state.countryFilter
                      )
                    : state.data;
                state.hasMoreData = action.payload.length >= state.limit;
            })
            .addCase(fetchPassengerData.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (action.payload as { message: string })?.message ||
                    'Failed to fetch passenger data';
            })
            // Fetch more data
            .addCase(fetchMorePassengerData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMorePassengerData.fulfilled, (state, action) => {
                state.data = [...state.data, ...action.payload.data];
                state.filteredData = state.countryFilter
                    ? state.data.filter(
                          (passenger) => passenger.country_code === state.countryFilter
                      )
                    : state.data;
                state.page = action.payload.newPage;
                state.hasMoreData = !action.payload.noMoreData;
                state.status = 'succeeded';
            })
            .addCase(fetchMorePassengerData.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (action.payload as { message: string })?.message ||
                    'Failed to fetch more passenger data';
                state.hasMoreData = false;
            });
    },
});

export const { setCountryFilter, clearCountryFilter } = passengerSlice.actions;
export default passengerSlice.reducer;
