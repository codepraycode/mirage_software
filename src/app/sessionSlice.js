import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { academic_session_channel } from '../constants/channels';
import { statuses } from '../constants/statuses';


const initialState = {
    status: statuses.idle, // 'idle' | 'loading' | 'loaded' |'failed'
    error: null,

    update_status: statuses.idle, // 'idle' | 'loading' | 'done' |'failed'
    update_error: null,

    sessions:null,
}


// Async Actions
export const loadSessions = createAsyncThunk('session/loadSessions', async () => {
    const all_sessions = await window.api.request(academic_session_channel.all);

    return all_sessions;
});


const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        sampleSettings(state, action) {
            console.log("Hello Redux!")
        },
    },

    extraReducers(builder) {
        builder
            .addCase(loadSessions.pending, (state, action) => {
                state.status = statuses.loading;
                state.error = null;
            })
            .addCase(loadSessions.fulfilled, (state, action) => {
                state.status = statuses.loaded;

                state.sessions = action.payload;
            })
            .addCase(loadSessions.rejected, (state, action) => {
                state.status = statuses.failed;
                state.error = action.error.message;
            })
    }
});


// Actions
// export const {} = sessionSlice.actions;


// Selectors

export const getSessions = (state) => state.session.sessions;
export const getSessionById = (state, session_id) => state.session.sessions?.find((ses)=>ses._id === session_id);

export const getSessionError = (state) => state.session.error;
export const getSessionStatus = (state) => state.session.status;
export const getSessionUpdateError = (state) => state.session.update_error;
export const getSessionUpdateStatus = (state) => state.session.update_status;

export default sessionSlice.reducer;