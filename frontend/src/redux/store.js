import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice"
import categoryReducer from "./slice/categorySlice"
import userServiceReqReducer from "./slice/userServiceRequestSlice"
import staffServiceReqReducer from "./slice/staffRequestSlice"
import notificationReducer from "./slice/notificationSlice"
import userReducer from "./slice/userSlice"
import chatReducer from "./slice/chatSlice"
import profileReducer from "./slice/profileSlice"

export const store = configureStore({
  reducer:{
    auth:authReducer,
    category:categoryReducer,
    userServiceReq : userServiceReqReducer,
    staffServiceReq:staffServiceReqReducer,
    notification:notificationReducer,
    user:userReducer,
    chat:chatReducer,
    profile:profileReducer
  }
})