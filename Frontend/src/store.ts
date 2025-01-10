import { configureStore } from '@reduxjs/toolkit';
import holidayReducer from '@/slices/holidaySlice';
import passengerReducer from '@/slices/passengerSlice';

export const store = configureStore({
    reducer: {
        holidays: holidayReducer,
        passengers: passengerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
