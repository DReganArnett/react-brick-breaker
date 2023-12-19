// Data for brick grid
const brickGridData = {
    nrows: 6, // number of rows of bricks
    ncols: 8, // number of columns of brick
    padding: 1,  // how far apart bricks are spaced
  } 
  
  // Data for ball
  const ballData = () => {
    return {
      x: 250,  // starting horizontal position of ball
      y: 150,  // starting vertical position of ball
      ballRadius: 10, // radius of the ball
      dx: 0.5,  // amount ball should move horizontally
      dy: -3,  // amount ball should move vertically
      color: "red",
      speed: 5,
    }
  }
  
  // Data for paddle
  const paddleData = () => {
    return {
      x: 250,   // starting horizontal position of paddle
      y: 490,   // starting vertical position of paddle
      width: 100, // paddle width (pixels)
      height: 10, 
      speed: 5, 
      dx: 1,  
      color: "black"
    }
  }
  
  // Data for bricks
  const brickData = () => {
    return {  
      x: 10,
      y: 10,
      width: 80,
      height: 20,
      offsetX: 10,
      offsetY: 10,
      isVisible: true,
    }
  }

export {brickGridData, ballData, paddleData, brickData}