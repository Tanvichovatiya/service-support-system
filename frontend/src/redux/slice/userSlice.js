import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staff:[],
  users: [],
  loadProfile:false,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    setStaff: (state, action) => {
      state.staff = action.payload;
    },

    setUsers: (state, action) => {
      state.users = action.payload;
    },

    clearStaff: (state) => {
      state.staff = null;
    },

    clearUsers: (state) => {
      state.users = [];
    },
    setLoadProfile:(state,action) =>{
      state.loadProfile = action.payload
    }
  },
});

export const {
  setStaff,
  setUsers,
  clearStaff,
  clearUsers,
  setLoadProfile
} = userSlice.actions;

export default userSlice.reducer;