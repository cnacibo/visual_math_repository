import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client'; // Импортируем ReactDOM
//
// // createRoot(document.getElementById('root')).render(
// //   <StrictMode>
// //     <App />
// //   </StrictMode>,
// // )
// const root = ReactDOM.createRoot(document.getElementById("app")); // ID должен быть "app"
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import './index.css';

//
// const root = createRoot(document.getElementById("app")); // Используем "app"
// root.render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
const root = ReactDOM.createRoot(document.getElementById("root")); // ID должен быть "root"
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);