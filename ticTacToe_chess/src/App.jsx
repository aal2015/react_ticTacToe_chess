import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { useNavigate } from "react-router";

function App() {
  let navigate = useNavigate();

  const navigatePage = (link) => {
    navigate(link);
  }

  return (
    <>
      <button type="button" onClick={() => navigatePage('/ticTacToe')}>Play Tic Tac Toe</button>
      <button type="button" onClick={() => navigatePage('/chess')}>Play Chess</button>
    </>
  )
}

export default App
