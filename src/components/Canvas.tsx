import {useRef, useEffect, useState} from 'react'
import '../App.css';
import NewGameBtn from './NewGameButton';
import DataDisplay from './DataDisplay';

//------------------------------------------------
// GLOBAL VARIABLES
//------------------------------------------------

// Data for ball
let ballX: number  = 200  // starting horizontal position of ball
let ballY: number  = 200  // starting vertical position of ball
const ballRadius: number  = 10 // radius of the ball
let ballDx: number  =  1  // amount ball should move horizontally
let ballDy: number  = -3  // amount ball should move vertically
const ballColor: string = "red" // color of ball

// Data for paddle
let paddleX: number  = 250  // starting horizontal position of paddle
const paddleY: number  =  490   // starting vertical position of paddle
let paddleWidth: number  = 100 // paddle width (pixels)
const paddleHeight: number  = 10 // paddle height (pixels)
const paddleDx: number  = 1
const paddleColor: string = "black"

// Data for bricks
const brickWidth: number  = 80; // width of each brick
const brickHeight: number  = 20 // height of each brick
const brickColors = ["orchid", "darkorchid", "lightgray", "lightpink"]

// Data for canvas
const nrows: number = 8 // number of rows of bricks
const ncols: number  = 8 // number of columns of brick
const padding: number = 1  // how far apart bricks are spaced
const rowheight: number = brickHeight + padding; // height of brick rows
const colwidth: number = brickWidth + padding // width of brick columns
const canvasWidth: number = 650;  // width of the game canvas
const canvasHeight: number = 500; // height of the game canvas  
  

function Canvas() {

    //-------------------------------------------------
    // REFERENCE MANAGEMENT
    //-------------------------------------------------
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const animationRef = useRef<number>();

    //-------------------------------------------------
    // STATE MANAGEMENT
    //-------------------------------------------------
    const [paused, setPaused] = useState<boolean>(false);
    const [paddleX, setPaddleX] = useState<number>(canvasWidth/2)
    const [bricks, setBricks] = useState<boolean[][]>([]);
    const [x, setX] = useState(ballX)
    const [y, setY] = useState(ballY)
    const [dx, setDx] = useState(ballDx)
    const [dy, setDy] = useState(ballDy)
    const [gameOver, setGameOver] = useState(false  )
    const [score, setScore] = useState(0);

    //-------------------------------------------------
    // SIDE EFFECTS OF RE-RENDERS
    //-------------------------------------------------
    // implements mouse functionality
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const context = canvas.getContext("2d");
        if (!context) return
        contextRef.current = context;
        const handleMouseMove = (event: MouseEvent) => {
            const canvasArea = canvas.getBoundingClientRect();
            const newX = event.clientX - canvasArea.x - paddleWidth / 2;
            setPaddleX(newX);
        };
        canvas.addEventListener('mousemove', handleMouseMove);
        setBricks(initBricks());
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // implements pause functionality
    useEffect(() => {
        const handleKeyDown = () => {
            setPaused(prev => !prev); 
        };
        window.addEventListener("keydown", handleKeyDown);
        const pauseGame = () => {
            if (!paused) {
                draw()
                animationRef.current = requestAnimationFrame(pauseGame);
            }
        };
        animationRef.current = requestAnimationFrame(pauseGame);
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
                window.removeEventListener("keydown", handleKeyDown)
        };
    }, [paused, paddleX, bricks, x, y]);

    //-----------------------------------------------
    // FUNCTION DECLARATIONS
    //-----------------------------------------------

    // Function to initialize bricks
    const initBricks = () => {
        const newBricks = new Array<boolean[]>(nrows);
        for (let i = 0; i < nrows; i++) {
            newBricks[i] = new Array<boolean>(ncols).fill(true);
        }
        return newBricks;
     };

    // draw the bricks on the canvas
    function drawBricks(context: CanvasRenderingContext2D) {
        for (let i = 0; i < nrows; i++) {
            for (let j = 0; j < ncols; j++) {
                if (bricks[i][j]) {
                    context.fillStyle = brickColors[(i + j) % brickColors.length];
                    const x = (j * (brickWidth + padding)) + padding;
                    const y = (i * (brickHeight + padding)) + padding;
                    context.fillRect(x, y, brickWidth, brickHeight);
                }
            }
        }
    }

    // initialize the game
    function init(){
        setBricks(initBricks());
        setGameOver(false)
        setPaused(false)
        setX(200)
        setY(200)
        setDy(-3)
        setScore(0)
    }

    // used to draw the ball
    function circle(context: CanvasRenderingContext2D, x: number,y: number,r: number) {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI*2, true);
        context.lineWidth = 4;
        context.stroke()
        context.closePath();
        context.fill();
    }

    function draw() {
        if (contextRef.current) {
            const context = contextRef.current;

            // clear the canvas
            context.clearRect(0, 0, canvasWidth, canvasHeight);

            // draw the paddle
            context.fillStyle = paddleColor;
            context.fillRect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);

            // draw the bricks
            drawBricks(context)

            // draw the ball
            context.fillStyle = ballColor;
            circle(context, x, y, ballRadius)
            context.fill();

            // find the row and column of brick 
            const currentRow = Math.floor(y / rowheight);
            const currentCol = Math.floor(x / colwidth);
            console.log(currentRow, currentCol)

            // check for brick collision
            if (y < nrows * rowheight && currentRow >= 0 && currentCol >= 0 && bricks[currentRow][currentCol]) {
                setDy(-dy)
                bricks[currentRow][currentCol] = false;
                //update score
                setScore(score + 1);
            }
            //contain the ball by rebounding it off the walls of the canvas
            if (x + ballRadius  + dx > canvasWidth || x - ballRadius + dx < 0)
                setDx(-dx);
            if (y - ballRadius + dy < 0) {
                setDy(-dy);
            } else if (y + ballRadius + dy > canvasHeight - paddleHeight) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                    setDy(-dy);
                }
            }
            if (y + dy > canvasHeight) {
                setGameOver(true)
                return
            }
            setX((prev)=> prev + dx);
            setY((prev)=> prev + dy);
            }
            setBricks([...bricks]);
        }

        if (gameOver) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };

    return (
        <div>
            <h4>Mouse moves platform &bull; Press any key to pause</h4>
            <NewGameBtn init={init} />
            <canvas id="gameCanvas" ref={canvasRef} />
            <DataDisplay score={score} paused={paused} gameOver={gameOver}/>
           
        </div>
    );
}

export default Canvas;