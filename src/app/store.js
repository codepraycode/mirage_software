import { configureStore } from '@reduxjs/toolkit';
import settingsSlice from './settingsSlice';
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        settings:settingsSlice,
        user:userSlice,
    }
})