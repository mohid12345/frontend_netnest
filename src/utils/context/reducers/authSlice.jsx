import {createSlice} from "@reduxjs/toolkit"

const userInitialState = {
    user : null,
    token : null,
}

const authSlice = createSlice({
    name : "auth",
    initialState: userInitialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.user.token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null
            state.post = []
        },
        setPosts: (state,action) => {
            state.posts = action.payload.posts
        },
        setAuthToken: (state,action) => {
            state.token= action.payload.token;
        }
    }
})

export const {loginSuccess,logout, setPosts,setAuthToken} = authSlice.actions
export default authSlice.reducer