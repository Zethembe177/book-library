import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],  // moved here from useState
  query: "",  // search query
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    borrowBook: (state, action) => {
      const book = state.books.find(b => b.id === action.payload);
      if (book) book.is_available = false;
    },
    returnBook: (state, action) => {
      const book = state.books.find(b => b.id === action.payload);
      if (book) book.is_available = true;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});
export const { setBooks, borrowBook, returnBook, setQuery } = bookSlice.actions;
export default bookSlice.reducer;
