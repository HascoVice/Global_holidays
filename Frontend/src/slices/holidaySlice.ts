import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchHolidays } from '@/api';
import Holiday from '@/types/Holiday';

interface HolidayState {
    data: Holiday[];
    filteredData: Holiday[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    page: number;
    limit: number;
    hasMoreData: boolean;
    countryFilter: string | null;
}

const initialState: HolidayState = {
    data: [],
    filteredData: [],
    status: 'idle',
    error: null,
    page: 0,
    limit: 10000,
    hasMoreData: true,
    countryFilter: null,
};

export const fetchHolidayData = createAsyncThunk(
    'holidays/fetchHolidayData',
    async (_, { getState }) => {
        const state = getState() as { holidays: HolidayState };
        const { page, limit } = state.holidays;
        const response = await fetchHolidays(page * limit, limit);
        return response;
    }
);

export const fetchMoreHolidayData = createAsyncThunk(
    'holidays/fetchMoreHolidayData',
    async (_, { getState }) => {
        const state = getState() as { holidays: HolidayState };
        const { page, limit } = state.holidays;

        if (!state.holidays.hasMoreData) return { data: [], newPage: page };

        const response = await fetchHolidays((page + 1) * limit, limit);

        if (!response || (Array.isArray(response) && response.length === 0)) {
            return { data: [], newPage: page, noMoreData: true };
        }

        if (!Array.isArray(response)) throw new Error(response?.message || 'Failed to fetch data.');

        return { data: response, newPage: page + 1 };
    }
);

const holidaySlice = createSlice({
    name: 'holidays',
    initialState,
    reducers: {
        setCountryFilter(state, action: PayloadAction<string | null>) {
            state.countryFilter = action.payload;
            state.filteredData = action.payload
                ? state.data.filter((holiday) => holiday.country_code === action.payload)
                : state.data;
        },
        clearCountryFilter(state) {
            state.countryFilter = null;
            state.filteredData = state.data;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHolidayData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHolidayData.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.status = 'succeeded';
                    state.data = action.payload;
                    state.filteredData = state.countryFilter
                        ? state.data.filter(
                              (holiday) => holiday.country_code === state.countryFilter
                          )
                        : state.data;
                } else {
                    state.status = 'failed';
                    state.error = action.payload?.message || 'Failed to fetch holiday data.';
                }
            })
            .addCase(fetchHolidayData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch holiday data';
            })
            .addCase(fetchMoreHolidayData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMoreHolidayData.fulfilled, (state, action) => {
                if (Array.isArray(action.payload?.data)) {
                    state.data = [...state.data, ...action.payload.data];
                    state.filteredData = state.countryFilter
                        ? state.data.filter(
                              (holiday) => holiday.country_code === state.countryFilter
                          )
                        : state.data;
                    state.page = action.payload.newPage;
                    state.hasMoreData = !action.payload.noMoreData;
                    state.status = 'succeeded';
                } else {
                    state.status = 'failed';
                    state.error = 'Failed to fetch more holiday data.';
                }
            })
            .addCase(fetchMoreHolidayData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch more holiday data';
            });
    },
});

export const { setCountryFilter, clearCountryFilter } = holidaySlice.actions;
export default holidaySlice.reducer;
