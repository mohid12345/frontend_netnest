import { combineReducers } from "redux";
import authReducer from "./reducers/authSlice"

const rootReducer = combineReducers({
    auth : authReducer,
})

export default rootReducer