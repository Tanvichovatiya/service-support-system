
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  loading: false,
  updateLoading: false,
  isEditModalOpen: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },

    setUpdateLoading: (state, action) => {
      state.updateLoading = action.payload;
    },

    openEditProfileModal: (state) => {
      state.isEditModalOpen = true;
    },

    closeEditProfileModal: (state) => {
      state.isEditModalOpen = false;
    },

    updateProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },

    setProfileError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProfile,
  setProfileLoading,
  setUpdateLoading,
  openEditProfileModal,
  closeEditProfileModal,
  updateProfile,
  setProfileError,
} = profileSlice.actions;

export default profileSlice.reducer;