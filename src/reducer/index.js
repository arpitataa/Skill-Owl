import {combineReducers} from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"

const rootReducer = combineReducers({
    //add all reducers
    auth:authReducer

})

export default rootReducer;