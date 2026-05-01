import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Chess from './components/Chess.jsx';
import TicTacToe from './components/TicTacToe.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chess" element={<Chess />} />
      <Route path="ticTacToe" element={<TicTacToe />} />
    </Routes>
  </BrowserRouter>,
)
