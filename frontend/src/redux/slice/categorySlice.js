import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  activeCategories: [],

  page: 1,
  limit: 5,
  totalCategories: 0,
  totalPages: 0,

  hasNextPage: false,
  hasPrevPage: false,
};

const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {
    setCategories: (state, action) => {
      const {
        categories,
        page,
        limit,
        totalCategories,
        totalPages,
      } = action.payload;

      state.categories = categories;
      state.page = page;
      state.limit = limit;
      state.totalCategories = totalCategories;
      state.totalPages = totalPages;

      state.hasPrevPage = page > 1;
      state.hasNextPage = page < totalPages;
    },

    clearCategories: (state) => {
      state.categories = [];
      state.page = 1;
      state.totalCategories = 0;
      state.totalPages = 0;
      state.hasNextPage = false;
      state.hasPrevPage = false;
    },
      setActiveCategories: (state, action) => {
      state.activeCategories = action.payload;
    },

    clearActiveCategories: (state) => {
      state.activeCategories = [];
    },
  },
});

export const {
  setCategories,
  clearCategories,setActiveCategories,clearActiveCategories
} = categorySlice.actions;

export default categorySlice.reducer;