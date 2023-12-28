import React from 'react';
import '../App.css';

interface Props {
    init: () => void;
}   

const NewGameBtn = ({init}: Props) => {
    return (
        <div id='btnContainer'>
            <button 
                id = "newGameBtn" 
                type = "button"
                onClick={() => init()}
            >
                New Game
            </button>
        </div>
    )
}

export default NewGameBtn;
