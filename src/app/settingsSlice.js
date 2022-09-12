import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
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
    
    roles:null,
    levels:null,

    grades:null,
    attrs:null,
}


// Async Actions
export const loadSettings = createAsyncThunk('settings/loadSettings', async () => {
    const app_settings = await window.api.request(settings_channel.all);

    return app_settings;
})

export const updateStaffs = createAsyncThunk('settings/updateStaffs', async (data) => {
    const res = await window.api.request(settings_channel.update, { section:'staffs', data});

    if(!res){
        return data;
    }

    return res;
    
})

export const deleteStaff = createAsyncThunk('settings/deleteStaff', async (staff_id) => {
    await window.api.request(settings_channel.delete, { section: 'staffs', _id:staff_id });

    return staff_id;

})


export const updateSchool = createAsyncThunk('settings/updateSchool', async (data) => {
    const res = await window.api.request(settings_channel.update, { section: 'school', data });

    if (!res) {
        return data;
    }

    return res;

});


export const updateRoles = createAsyncThunk('settings/updateRoles', async (data) => {
    const res = await window.api.request(settings_channel.update, { section: 'roles', data });

    if (!res) {
        return data;
    }

    return res;

})


export const updateLevel = createAsyncThunk('settings/updateLevel', async (data) => {

    await window.api.request(settings_channel.update, { section: 'levels', data });

    return data;

})

export const updateSubject = createAsyncThunk('settings/updateSubject', async (data) => {

    await window.api.request(settings_channel.update, { section: 'subjects', data });

    return data;

})



export const updateSessionSetting = createAsyncThunk('settings/updateSessionSetting', async (data) => {
    const res = await window.api.request(settings_channel.update, { section: 'sessions', data });

    if (!res) {
        return data;
    }

    return res;

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
                state.school = settings.school || null;
                state.sessions = settings.sessions || null;
                state.subjects = settings.subjects || null;
                state.staffs = settings.staffs || null;
                state.roles = settings.roles || null;
                state.levels = settings.levels || null;

                state.grades = settings.grades || null;
                state.attrs = settings.attrs || null;

            })
            .addCase(loadSettings.rejected, (state, action) => {
                state.status = statuses.failed;
                state.error = action.error.message;
            })

            // Update School
            .addCase(updateSchool.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                state.school = {...state.school,...action.payload};
            })
            .addCase(updateSchool.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })

            // Update Roles
            .addCase(updateRoles.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                state.roles = { ...state.roles,...action.payload};
            })
            .addCase(updateRoles.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })


            // Update Sessions
            .addCase(updateSessionSetting.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                state.sessions = { ...state.sessions,...action.payload};
            })
            .addCase(updateSessionSetting.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })

            // Update Levels
            .addCase(updateLevel.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                state.levels = { ...state.levels, ...action.payload};
            })
            .addCase(updateLevel.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })

            // Update subjects
            .addCase(updateSubject.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                state.subjects = { ...state.subjects, ...action.payload};
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })

            // Update Staffs
            .addCase(updateStaffs.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                const data = action.payload;

                const { _id } = data;

                let updated = false;

                state.staffs = state.staffs.map((each) => {

                    if (each._id === _id) {
                        updated = true;

                        return {
                            ...each,
                            ...data,
                        }
                    }

                    return each;

                });

                if(!updated){
                    state.staffs = [...state.staffs, data];
                }

            })
            .addCase(updateStaffs.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })
            // Delete Staff
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.update_status = statuses.idle

                const staff_id = action.payload;
                state.staffs = state.staffs.filter((each) => each._id !== staff_id);
                

            })
            .addCase(deleteStaff.rejected, (state, action) => {
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
export const getSettingsStaffById = (state, staff_id) => state.settings.staffs.find((staff)=> staff._id === staff_id);

export const getSettingsRoles = (state) => state.settings.roles;
export const getSettingsLevels = (state) => state.settings.levels;
export const getSettingsLevelById = (state, levelId) => state.settings.levels[levelId];


export const getSettingsGrades = (state) => state.settings.grades;
export const getSettingsAttrs = (state) => state.settings.attrs;

export const getSettingsError = (state) => state.settings.error;
export const getSettingsStatus = (state) => state.settings.status;
export const getSettingsUpdateError = (state) => state.settings.update_error;
export const getSettingsUpdateStatus = (state) => state.settings.update_status;

export default settingsSlice.reducer;