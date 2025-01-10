import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiError, fetchHolidays } from '@/api';
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

// Fetch initial holiday data
export const fetchHolidayData = createAsyncThunk<
    Holiday[],
    void,
    { rejectValue: { message: string } }
>('holidays/fetchHolidayData', async (_, { rejectWithValue }) => {
    try {
        const response = await fetchHolidays(0, initialState.limit);
        if (!response || (response as Holiday[]).length === 0) {
            return rejectWithValue({ message: 'No data found' });
        }
        return response;
    } catch (error: any) {
        return rejectWithValue({ message: error.message || 'Failed to fetch holiday data' });
    }
});

// Fetch more holiday data (pagination)
export const fetchMoreHolidayData = createAsyncThunk<
    { data: Holiday[]; newPage: number; noMoreData: boolean },
    void,
    { rejectValue: { message: string } }
>('holidays/fetchMoreHolidayData', async (_, { getState, rejectWithValue }) => {
    const state = getState() as { holidays: HolidayState };
    const { page, limit, hasMoreData } = state.holidays;

    if (!hasMoreData) {
        return { data: [], newPage: page, noMoreData: true };
    }

    try {
        const response = await fetchHolidays((page + 1) * limit, limit);

        if (!response || (response as Holiday[]).length === 0) {
            return { data: [], newPage: page, noMoreData: true };
        }

        return {
            data: response,
            newPage: page + 1,
            noMoreData: (response as Holiday[]).length < limit,
        };
    } catch (error: any) {
        return rejectWithValue({ message: error.message || 'Failed to fetch more holiday data' });
    }
});

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
            // Fetch initial data
            .addCase(fetchHolidayData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchHolidayData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
                state.filteredData = state.countryFilter
                    ? state.data.filter((holiday) => holiday.country_code === state.countryFilter)
                    : state.data;
                state.hasMoreData = action.payload.length >= state.limit;
            })
            .addCase(fetchHolidayData.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (action.payload as ApiError)?.message || 'Failed to fetch holiday data';
            })
            // Fetch more data
            .addCase(fetchMoreHolidayData.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMoreHolidayData.fulfilled, (state, action) => {
                state.data = [...state.data, ...action.payload.data];
                state.filteredData = state.countryFilter
                    ? state.data.filter((holiday) => holiday.country_code === state.countryFilter)
                    : state.data;
                state.page = action.payload.newPage;
                state.hasMoreData = !action.payload.noMoreData;
                state.status = 'succeeded';
            })
            .addCase(fetchMoreHolidayData.rejected, (state, action) => {
                state.status = 'failed';
                state.error =
                    (action.payload as ApiError)?.message || 'Failed to fetch more holiday data';
                state.hasMoreData = false;
            });
    },
});

export const { setCountryFilter, clearCountryFilter } = holidaySlice.actions;
export default holidaySlice.reducer;
