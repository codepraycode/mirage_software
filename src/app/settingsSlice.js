import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { settings_channel } from '../constants/channels';
import { statuses } from '../constants/statuses';


const initialState = {
    status: statuses.idle, // 'idle' | 'loading' | 'loaded' |'failed'
    error: null,

    update_status: statuses.idle, // 'idle' | 'loading' | 'done' |'failed'
    update_error: null,
    
    // Settings
    school:null,
    sessions: null,
    subjects: null,
    staffs: null,
}


// Async Actions
export const loadSettings = createAsyncThunk('settings/loadSettings', async () => {
    const app_settings = await window.api.request(settings_channel.all);

    return app_settings;
})

export const updateSettings = createAsyncThunk('settings/updateSettings', async ({section,data}) => {
    await window.api.request(settings_channel.update, {section, data});
    return {section,data};
})

const settingsSlice = createSlice({
    name:'settings',
    initialState,
    reducers:{
        sampleSettings(state,action){
            console.log("Hello Redux!")
        },
    },

    extraReducers(builder){
        builder
            .addCase(loadSettings.pending,(state,action)=>{
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loadSettings.fulfilled, (state, action) => {
                state.status = 'loaded';

                const settings = action.payload;

                // console.log(settings);

                state.software = settings.software || null;
                state.school = settings.school || null;
                state.sessions = settings.sessions || null;
                state.subjects = settings.subjects || null;
                state.staffs = settings.staffs || null;

            })
            .addCase(loadSettings.rejected, (state, action) => {
                state.status = statuses.failed;
                state.error = action.error.message;
            })

            // Update Instance
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                const {section, data} = action.payload;

                const setting_section = state[section];

                state[section] = { ...setting_section, ...data };

            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })
    }
});


// Actions
// export const {} = instanceSlice.actions;


// Selectors
export const getSettingsSchool = (state)=>state.settings.school;
export const getSettingsSessions = (state) => state.settings.sessions;
export const getSettingsSubjects = (state) => state.settings.subjects;
export const getSettingsStaffs = (state) => state.settings.staffs;


export const getSettingsError = (state) => state.settings.error;
export const getSettingsStatus = (state) => state.settings.status;
export const getSettingsUpdateError = (state) => state.settings.update_error;
export const getSettingsUpdateStatus = (state) => state.settings.update_status;

export default settingsSlice.reducer;