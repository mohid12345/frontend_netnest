import { combineReducers } from "redux";
import authReducer from "./reducers/authSlice"
import adminAuthReducer from "./reducers/adminAuthSlice"

const rootReducer = combineReducers({
    auth : authReducer,
    adminAuth : adminAuthReducer
})

export default rootReducer