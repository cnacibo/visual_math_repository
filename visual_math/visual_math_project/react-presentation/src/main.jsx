// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client'; // Импортируем ReactDOM

// import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root")); // ID должен быть "root"
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);