import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { schoolset_channel } from '../constants/channels';
import { statuses } from '../constants/statuses';


const initialState = {
    status: statuses.idle, // 'idle' | 'loading' | 'loaded' |'failed'
    error: null,

    update_status: statuses.idle, // 'idle' | 'loading' | 'done' |'failed'
    update_error: null,

    // Settings
    sets: null,
}


// Async Actions
export const loadSets = createAsyncThunk('set/loadSets', async () => {
    const all_sets = await window.api.request(schoolset_channel.all);

    return all_sets;
});

export const createSet = createAsyncThunk('set/createSet', async (set_data) => {
    const [error, data] = await window.api.request(schoolset_channel.new, set_data);

    if(Boolean(error)){
        throw Error(error);
    }

    return data;
});


const setSlice = createSlice({
    name: 'set',
    initialState,
    reducers: {
        sampleSettings(state, action) {
            console.log("Hello Redux!")
        },
    },

    extraReducers(builder) {
        builder
            .addCase(loadSets.pending, (state, action) => {
                state.status = statuses.loading;
                state.error = null;
            })
            .addCase(loadSets.fulfilled, (state, action) => {
                state.status = statuses.loaded;

                state.sets = action.payload;
            })
            .addCase(loadSets.rejected, (state, action) => {
                state.status = statuses.failed;
                state.error = action.error.message;
            })

            // Create set
            .addCase(createSet.pending, (state, action) => {
                state.update_status = statuses.loading;
                state.update_error = null;
            })
            .addCase(createSet.fulfilled, (state, action) => {
                state.update_status = statuses.idle;


                if(Array.isArray(state.sets) && state.sets.length < 1){
                    state.sets = [action.payload];
                }else{
                    state.sets = [...state.sets, action.payload];
                }

            })
            .addCase(createSet.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })
    }
});


// Actions
// export const {} = instanceSlice.actions;


// Selectors
export const getAllSets = (state) => state.set.sets;
export const getOpenedSet = (state) => state.set.sets?.find((st) => st.isOpened === true);

export const getSetError = (state) => state.set.error;
export const getSetStatus = (state) => state.set.status;
export const getSetUpdateError = (state) => state.set.update_error;
export const getSetUpdateStatus = (state) => state.set.update_status;

export default setSlice.reducer;