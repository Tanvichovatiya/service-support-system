import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,

  showPassword: false,
  loading: false,
  errors: {},
  error: "",
  verificationEmail: "",
  isStaff:false,
  isUser:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    clearUser: (state) => {
      state.user = null;
    },

    setShowPassword: (state, action) => {
      state.showPassword = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setErrors: (state, action) => {
      state.errors = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setVerificationEmail: (state, action) => {
      state.verificationEmail = action.payload;
    },
    setIsStaff :(state,action) =>{
      state.isStaff = action.payload
    },
    setIsUser:(state,action) =>{
      state.isUser = action.payload
    },

    clearErrors: (state) => {
      state.errors = {};
    },
  },
});

export const {
  setUser,
  clearUser,
  setShowPassword,
  setLoading,
  setErrors,
  clearErrors,
  setError,
  setVerificationEmail,
  setIsStaff,setIsUser
} = authSlice.actions;

export default authSlice.reducer;