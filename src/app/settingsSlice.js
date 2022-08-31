import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { settings_channel } from '../constants/channels';
import { statuses } from '../constants/statuses';


const initialState = {
    status: statuses.idle, // 'idle' | 'loading' | 'loaded' |'failed'
    
    // Settings
    school:null,
    software:null,
    sessions: null,
    subjects: null,
    staffs: null,

    error:null,
}


// Async Actions
export const loadSettings = createAsyncThunk('settings/loadSettings', async () => {
    const app_settings = await window.api.request(settings_channel.all);

    // return {
    //     school: school_setting,
    //     software: software_setting
    // }
    return app_settings;
})

export const updateSettings = createAsyncThunk('settings/updateSettings', async (setting_data) => {
    await window.api.request(settings_channel.initialize, setting_data)
    return setting_data;
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
                state.status = 'loaded'

                const settings = action.payload;

                state.software = settings.software || null;
                state.school = settings.school || null;
                state.sessions = settings.sessions || null;
                state.subjects = settings.subjects || null;
                state.staffs = settings.staffs || null;

            })
            .addCase(loadSettings.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message;
            })

            // Update Instance
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.status = 'loaded'

                state = {...state,...action.payload};

            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message;
            })
    }
});


// Actions
// export const {} = instanceSlice.actions;


// Selectors
export const getSettingsSoftware = (state)=>state.settings.software;
export const getSettingsSchool = (state)=>state.settings.school;
export const getSettingsSessions = (state) => state.settings.sessions;
export const getSettingsSubjects = (state) => state.settings.subjects;
export const getSettingsStaffs = (state) => state.settings.staffs;


export const getInstanceError = (state) => state.settings.error;
export const getSettingsStatus = (state) => state.settings.status;

export default settingsSlice.reducer;