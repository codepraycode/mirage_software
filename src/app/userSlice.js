import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { account_channel } from '../constants/channels';
import { statuses } from '../constants/statuses';


const initialState = {
    status: statuses.idle, // 'idle' | 'loading' | 'loaded' |'failed'
    error: null,

    update_status: statuses.idle, // 'idle' | 'loading' | 'done' |'failed'
    update_error: null,

    // Settings
    users: null,
    auth_user:null,
}


// Async Actions
export const loadUsers = createAsyncThunk('user/loadUsers', async () => {
    const app_users = await window.api.request(account_channel.all);

    return app_users;
})

export const authenticate = createAsyncThunk('user/authenticate', async (auth_data) => {
    const [error,auth_user] = await window.api.request(account_channel.authenticate, auth_data);

    if(error){
        throw Error(error);
    }

    return auth_user;
});

export const addUser = createAsyncThunk('user/addUser', async (user_data) => {
    
    const [error] = await window.api.request(account_channel.new, user_data);

    if(error){
        throw(error);
    }

    return user_data;
});


export const updateUser = createAsyncThunk('user/updateUser', async (user_data) => {
    
    await window.api.request(account_channel.update, user_data);


    return user_data;
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOut(state, action) {
            state.auth_user = null;
        },
        updateAuth(state, action) {
            state.auth_user = { ...state.auth_user,...action.payload};
        },
    },

    extraReducers(builder) {
        builder
            .addCase(loadUsers.pending, (state, action) => {
                state.status = statuses.loading;
                state.error = null;
            })
            .addCase(loadUsers.fulfilled, (state, action) => {
                state.status = statuses.loaded;
                state.users = action.payload;
            })
            .addCase(loadUsers.rejected, (state, action) => {
                state.status = statuses.failed;
                state.error = action.error.message;
            })

            // Authenticate
            .addCase(authenticate.pending, (state, action) => {
                state.update_status = statuses.loading
                state.update_error = null;
            })
            .addCase(authenticate.fulfilled, (state, action) => {
                state.update_status = statuses.idle
                state.auth_user = action.payload;
            })
            .addCase(authenticate.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })


            // Add user
            .addCase(addUser.pending, (state, action) => {
                state.update_status = statuses.loading
                state.update_error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.update_status = statuses.idle;
                const user = action.payload;


                if(!Boolean(state.users)){
                    state.users = [user];
                }else{
                    state.users = [...state.users, user];
                }

            })
            .addCase(addUser.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })

            // Update User
            .addCase(updateUser.fulfilled, (state, action) => {
                state.update_status = statuses.idle;
                const user = action.payload;


                if(!Array.isArray(state.users)){
                    state.users = [user];
                }else{

                    state.users = state.users.map((suser)=>{
                        if(suser._id === user._id){
                            return {
                                ...suser,
                                ...user
                            }
                        }


                        return suser;
                    })

                }

            })
            .addCase(updateUser.rejected, (state, action) => {
                state.update_status = statuses.failed;
                state.update_error = action.error.message;
            })

            
    }
});


// Actions
export const { logOut, updateAuth } = userSlice.actions;


// Selectors
export const getUsers = (state) => state.user.users;
export const getAuthUser = (state) => state.user.auth_user;


export const getUserError = (state) => state.user.error;
export const getUserStatus = (state) => state.user.status;
export const getUserUpdateError = (state) => state.user.update_error;
export const getUserUpdateStatus = (state) => state.user.update_status;

export default userSlice.reducer;