import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  page: 1,
  limit: 0,
  totalRequest: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

export const userServiceRequestSlice = createSlice({
  name: "userServiceRequest",

  initialState,

  reducers: {
    setRequests: (state, action) => {
      const {
        requests = [],
        page = 1,
        limit = 1,
        totalRequest = 0,
        totalPages = 0,
      } = action.payload;

      state.requests = requests;
      state.page = page;
      state.limit = limit;
      state.totalRequest = totalRequest;
      state.totalPages = totalPages;

      state.hasPrevPage = page > 1;
      state.hasNextPage = page < totalPages;
    },

    clearRequest: (state) => {
      state.requests = [];
      state.page = 1;
      state.limit = 6;
      state.totalRequest = 0;
      state.totalPages = 0;
      state.hasNextPage = false;
      state.hasPrevPage = false;
    },
  },
});

export const {
  setRequests,
  clearRequest,
} = userServiceRequestSlice.actions;

export default userServiceRequestSlice.reducer;