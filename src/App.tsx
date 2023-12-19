import React, { KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import './App.css'
import NewGameBtn from './components/NewGameButton'
import GameOverAlert from './components/GameOverAlert';
import Game from './components/Game';


function App() {
  

  return (
    <div className="App">
      <Game />
    </div>  
  )
}

export default App
