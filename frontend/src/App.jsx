
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home.jsx'
import React from "react";
import NavBar from './components/NavBar.jsx';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddBook from './pages/AddBook.jsx';
function App() {
  return (
    <Router>
      <NavBar />   {/* ✅ Shows on every page */}
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddBook />} />
          
        </Routes>
      </div>
    </Router>
  );
}


export default App
