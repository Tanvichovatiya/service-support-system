
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],

  page: 1,
  limit: 9,
  totalRequest: 0,
  totalPages: 0,

  hasNextPage: false,
  hasPrevPage: false,
};

const staffRequestSlice = createSlice({
  name: "assignedRequest",

  initialState,

  reducers: {
    setAssignedRequests: (state, action) => {
      const {
        requests,
        page,
        limit,
        totalRequest,
        totalPages,
      } = action.payload;

      state.requests = requests;
      state.page = page;
      state.limit = limit;
      state.totalRequest = totalRequest;
      state.totalPages = totalPages;

      state.hasPrevPage = page > 1;
      state.hasNextPage = page < totalPages;
    },

    clearAssignedRequests: (state) => {
      state.requests = [];
      state.page = 1;
      state.limit = 9;
      state.totalRequest = 0;
      state.totalPages = 0;
      state.hasNextPage = false;
      state.hasPrevPage = false;
    },
  },
});

export const {
  setAssignedRequests,
  clearAssignedRequests,
} = staffRequestSlice.actions;

export default staffRequestSlice.reducer;