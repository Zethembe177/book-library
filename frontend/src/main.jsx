import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";

import './index.css'
import App from './App.jsx'
import "tailwindcss";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);