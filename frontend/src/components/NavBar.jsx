import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setBooks } from "../store/bookSlice";

const NavBar = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      dispatch(setBooks([])); // clear results if query is empty
      return;
    }

    try {
      const response = await fetch(
        `https://book-library-backend-xf69.onrender.com/api/books/search?title=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      dispatch(setBooks(data)); // update Redux store with search results
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <nav className="bg-white w-full flex relative justify-between items-center mx-auto px-8 h-20">
      <form onSubmit={handleSearch} className="hidden sm:flex flex-shrink flex-grow-0 justify-start px-2">
        <div className="inline-flex items-center max-w-full">
          <input
            type="text"
            placeholder="Search by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex items-center flex-grow-0 flex-shrink pl-2 w-60 border rounded-full px-1 py-1"
          />
          <button
            type="submit"
            className="flex items-center justify-center h-8 w-8 rounded-full ml-2"
          >
            🔍
          </button>
        </div>
      </form>
    </nav>
  );
};

export default NavBar;
