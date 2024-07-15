import {createSlice} from "@reduxjs/toolkit"

const userInitialState = {
    user : null,
    token : null,
}

const authSlice = createSlice({
    name : "auth",
    initialState: userInitialState,
    reducers: {
        loginSuccess: (state, action) =>{
            state.user = action.payload.user;
            state.token = action.payload.user.token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null
            state.post = []
        },
    }
})

export const {loginSuccess,logout} = authSlice.actions
export default authSlice.reducer