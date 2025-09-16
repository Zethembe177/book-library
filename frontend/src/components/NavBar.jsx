import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBooks, setQuery, borrowBook as borrowBookAction, returnBook as returnBookAction } from "../store/bookSlice";




const NavBar = () => {
  const [query, setQuery] = useState("");
  const handleSearch = (e) => {
  e.preventDefault();
  console.log("Searching for:", query);
};
  return (
    <nav className="bg-white w-full flex relative justify-between items-center mx-auto px-8 h-20">
      <div className="hidden sm:block flex-shrink flex-grow-0 justify-start px-2">
        <div className="inline-block">
          <div className="inline-flex items-center max-w-full">
           <input
  type="text"
  placeholder="Start your search"
  value={query}
  onChange={(e) => setQuery(e.target.value)}

  className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-60 border rounded-full px-1 py-1"
/>

<div className="flex items-center justify-center relative h-8 w-8 rounded-full">
  🔍
</div>


          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
