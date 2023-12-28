import React from 'react';
import '../App.css';

interface Props {
    score: number,
    paused: boolean,
    gameOver: boolean,
}

const DataDisplay = ({score, paused, gameOver}: Props) => {
    return (
        <div className="data">
            <h2>Score: {score}</h2>
            {gameOver ? <div className='gameOverDiv'>
                            <div className='gameOver'>Game Over!</div>
                        </div>
                            : 
                        <div className='gameOnDiv'>
                            <div className='gameOn'>Game On!</div>
                        </div>  
            }                
            
      </div>
    )
}

export default DataDisplay;