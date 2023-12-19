import React, { useRef, useEffect, useState, MouseEvent, KeyboardEvent } from 'react';
import '../App.css';
import GameOverAlert from './GameOverAlert';
import NewGameBtn from './NewGameButton';
import {brickGridData, ballData, paddleData, brickData} from '../data';

 
const Game = () => {  
  //-------------------------
  // STATES
  //-------------------------
  let [score, setScore] = useState(0);
  let [pause, setPause] = useState(false);
  let [gameOn, setGameOn] = useState(true);
  let [gameOver, setGameOver] = useState(false);
  let [ball, setBall] = useState(ballData);
  let [paddle, setPaddle] = useState(paddleData);
  let [brick, setBrick] = useState(brickData);
  let [bricks, setBricks] = useState(new Array({length:brickGridData.nrows},() => Array(brickGridData.ncols).fill(true)));
  let [intervalId, setIntervalId] = useState(0)
  
  //--------------------------
  // REFERENCES
  //--------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const ballRef = useRef(ball);
  const paddleRef = useRef(paddle);
 
  //-------------------------
  // VARIABLE DEFINITIONS
  //-------------------------
  const canvas = canvasRef.current;
  const canvasWidth = 650;  // width of the game canvas
  const canvasHeight = 500; // height of the game canvas  
  const brickColors = ["orchid", "darkorchid", "lightgray", "lightpink"]
  const brickWidth = 80;
  const brickHeight = 20;
 
  // Create and array of arrays of bricks, and initialize to be true (meaning visible)
  const init_bricks = (): boolean[][] => {
    let brickArray: boolean[][] = [];
    for (let i=0; i < brickGridData.nrows; i++) { // for each row of bricks
      bricks[i] = new Array(brickGridData.ncols);
      for (let j=0; j < brickGridData.ncols; j++) { // for each column of bricks
          bricks[i][j] = true;
      }
    }
    return brickArray;
  };
  
  //-------------------------
  // FUNCTIONS
  //------------------------- 

  // draws the ball
  function draw_ball() {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext('2d');
    let ctx = canvasCtxRef.current
    ballRef.current = ball;
    ctx!.beginPath()  // Note the non null assertion
    ctx!.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI*2);
    ctx!.lineWidth = 4;
    ctx!.stroke()
    ctx!.fillStyle = ball.color;
    ctx!.fill()
    ctx!.closePath()
  }

  // draws the paddle
  function draw_paddle() {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext('2d');
    let ctx = canvasCtxRef.current;
    paddleRef.current = paddle;
    ctx!.beginPath();
    ctx!.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx!.lineWidth = 4;
    ctx!.stroke()
    ctx!.fillStyle = paddle.color;
    ctx!.fill();
    ctx!.closePath() 
  }

  function draw_bricks() {
    if (!canvasRef.current) return; 
    canvasCtxRef.current = canvasRef.current.getContext('2d');
    let ctx = canvasCtxRef.current;
    if(!ctx) return;
    bricks.map((row, rowIndex) => {
      row.map((brick: any, colIndex: number) => {
        if (brick) {
          ctx!.fillStyle = brickColors[(rowIndex + colIndex) % brickColors.length];
          let brickX = colIndex * (brickWidth + brickGridData.padding) + brickGridData.padding;
          let brickY = rowIndex * (brickHeight + brickGridData.padding) + brickGridData.padding;
          ctx!.fillRect(brickX, brickY, brickWidth, brickHeight);
        }
      });
    });
  }

  // clear the screen in between drawing each animation
  function clear() {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext('2d');
    let ctx = canvasCtxRef.current
    ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  const resetGame = () => {
    
    setBricks(new Array({length: brickGridData.nrows},() => Array(brickGridData.ncols).fill(true)));
    setScore(0);
    setGameOver(false);
    setIntervalId(0)
    start_animation()
  };

  function draw() {
    if (!canvasRef.current) return 
    canvasCtxRef.current = canvasRef.current.getContext('2d');
    let ctx = canvasCtxRef.current
    ctx!.clearRect(0, 0, canvasWidth, canvasHeight);

    draw_bricks();  
    draw_ball(); 
    draw_paddle(); 

    //check if we have hit a brick
    let rowheight = brick.height + brickGridData.padding;
    let colwidth = brick.width + brickGridData.padding;
    let row: number = Math.floor(ball.y/rowheight);
    let col: number = Math.floor(ball.x/colwidth);

    if (ball.y < brickGridData.nrows * rowheight && row >=0 && col >= 0 && bricks[row][col]) {
      ball.dy = -ball.dy;
      bricks[row][col] = false;
      if (!bricks[row][col]) setScore(score ++); // If a brick is hit, add 1 to score
    }    

    //contain the ball by rebouding it off the walls of the canvas
    if (ball.x + ball.dx > canvasWidth || ball.x + ball.dx < 0) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < 0) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvasHeight - paddle.height) {
      // check if the ball is hitting the 
      // paddle and if it is rebound it
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
      }
    }
    if (ball.y + ball.dy > canvasHeight) {
      //game over, so stop the animation
      stop_animation();
      setGameOver(true)
      return
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
  } 

  // initialize game
  function init() {
    setScore(0);
    init_bricks()
    start_animation();
  }

  function start_animation() {
    setInterval(draw, 10);
  }
  
  function stop_animation() {
    clearInterval(intervalId);
  }

  useEffect (() => {
    init();
  }, [bricks])


  return (
    <div className="App">
      <h1>Brick Breaker!</h1>
      <canvas 
        id = "gameCanvas"
        ref = {canvasRef}
        width = {canvasWidth}
        height = {canvasHeight}
        onMouseMove={(event) => {paddle.x = event.clientX - (canvasWidth-paddle.width/2)}}
        onKeyDown={(event) => {pause ? setPause(false) : setPause(true)}}>
      </canvas>
      {gameOver ? <GameOverAlert /> : null}
      <div className="data">
        <p>Mouse moves platform &bull; Press any key to pause</p>
        <h3>Score: {score}</h3>
        <NewGameBtn />
      </div>
    </div>
  )
}
export default Game;