// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setBooks, setQuery, borrowBook as borrowBookAction, returnBook as returnBookAction } from "../store/bookSlice";


const Home = () => {
  const books = useSelector((state) => state.books.books); // gets all books
const query = useSelector((state) => state.books.query); // gets the search query
const dispatch = useDispatch();
const filteredBooks = books.filter((book) =>
  book.title.toLowerCase().includes(query.toLowerCase()) ||
  book.author.toLowerCase().includes(query.toLowerCase()) ||
  book.category.toLowerCase().includes(query.toLowerCase())
);

const API_BASE =  "https://book-library-production-eb37.up.railway.app/api";

  // Fetch books from backend
  
const fetchBooks = async () => {
  try {
    const res = await axios.get(`${API_BASE}/books`)
;
    dispatch(setBooks(res.data)); // update Redux state
  } catch (err) {
    console.error("Error fetching books:", err);
  }
};

useEffect(() => {
  fetchBooks(); // only called once when Home mounts
}, []);

  // Borrow a book
  const borrowBook = async (id) => {
    try {
      await axios.post(`${API_BASE}/books/borrow/${id}`, {
  borrower_name: "John Doe",
  borrowed_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
});

      dispatch(borrowBookAction(id)); // marks book as borrowed in Redux
    } catch (err) {
      console.error(err);
    }
  };

  // Return a book
  const returnBook = async (id) => {
    try {
      await axios.post(`${API_BASE}/books/return/${id}`, {
        returned_date: new Date().toISOString().split("T")[0],
      });
        dispatch(returnBookAction(id)); // marks book as available in Redux
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Add Book Button */}
      <div className="container mx-auto p-4">
        <Link to="/add">
          <button className="bg-teal-500 text-white px-4 py-2 rounded mb-4">
            Add Book
          </button>
        </Link>
      </div>

      {/* Books Table */}
      <div className="container mx-auto p-4">
       
        <h1 className="text-2xl font-bold mb-4">Library Books</h1>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} className="text-center odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{book.title}</td>
                <td className="p-2 border">{book.author}</td>
                <td className="p-2 border">{book.category}</td>
                <td className="p-2 border">
                  {book.is_available ? (
    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
      Available
    </span>
  ) : (
    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
      Borrowed
    </span>
  )}
                </td>
                <td className="p-2 border">
                  {book.is_available ? (
                    <button
                      onClick={() => borrowBook(book.id)}
                      className="bg-fuchsia-500 text-white px-3 py-1 rounded"
                    >
                      Borrow
                    </button>
                  ) : (
                    <button
                      onClick={() => returnBook(book.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
