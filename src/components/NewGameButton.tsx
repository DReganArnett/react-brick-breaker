import React from 'react';
import '../App.css';
import '../data';

const NewGameBtn = () => {
    return (
        <div>
            <button 
                id = "newGameBtn" 
                onClick={() => resetGame()}
            >
                New Game
            </button>
        </div>
    )
}

export default NewGameBtn;
