import { configureStore } from '@reduxjs/toolkit';
import sessionSlice from './sessionSlice';
import setSlice from './setSlice';
import settingsSlice from './settingsSlice';
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        settings:settingsSlice,
        user:userSlice,
        set:setSlice,
        session:sessionSlice,
    }
})