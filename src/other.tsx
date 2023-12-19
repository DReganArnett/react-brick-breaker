  //-------------------------
  // STATE MANAGEMENT
  //-------------------------

  // const [score, setScore] = useState(0);    // store the number of bricks eliminated
  // const [bricks, setBricks] = useState(createBricks); 
  // const [ball, setBall] = useState(ballData);
  // const [paddle, setPaddle] = useState(paddleData);
  // const [gameInProgress, setGameInProgress] = useState(false);
  // const [hasLostGame, setHasLostGame] = useState(false);
  // const [paused, setPaused] = useState(true);

  //--------------------------
  // REFERENCE MANAGEMENT
  //--------------------------
  // const ballRef = useRef(ball);
  // ballRef.current = ball;
  // const paddleRef = useRef(paddle);
  // paddleRef.current = paddle;
  // const bricksRef = useRef(bricks);
  // bricksRef.current = bricks;
  // const scoreRef = useRef(score);
  // scoreRef.current = score;
  // const gameRef = useRef(gameInProgress);
  // gameRef.current = gameInProgress;
  // const lostRef = useRef(hasLostGame);
  // lostRef.current = hasLostGame;


  // // Creates the array grid that will hold the bricks
  // const create_bricks = () => {
  //   const bricks = [];
  //   for (let i=0; i<10; i++) {
  //     for (let j = 0; j<5; j++) {
  //       bricks.push({
  //         x: brickData.x + (brickData.width + brickData.offsetX) * i,
  //         y: brickData.y + (brickData.height + brickData.offsetY) * j,
  //         width: brickData.width,
  //         height: brickData.height,
  //         colors: brickData.colors,
  //         isVisible: brickData.isVisible,
  //       });
  //     }
  //   }
  //   return bricks;
  // }

  function draw() {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext('2d');
    let ctx = canvasCtxRef.current
    
    // before drawing, change the fill color
    ctx!.fillStyle = backcolor;
    clear();
    ctx!.fillStyle = ballData.color;
    //draw the ball
    draw_ball();
    ctx!.fillStyle = paddleData.color;
    //draw the paddle
    
    rect(paddleData.x, canvasHeight-paddleData.height, paddleData.width, paddleData.height);
    draw_bricks();
  
    //check if we have hit a brick
    let rowheight = brickData.height + brickGridData.padding;
    let colwidth = brickData.width + brickGridData.padding;
    let row = Math.floor(ballData.y/rowheight);
    let col = Math.floor(ballData.x/colwidth);
    //if so reverse the ball and mark the brick as broken and add 1 to score
    if (ballData.y < brickGridData.nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
      ballData.dy = -ballData.dy;
      bricks[row][col] = false;
      setScore(score+1);
    }
   
    //contain the ball by rebouding it off the walls of the canvas
    if (x + dx > width || x + dx < 0)
      dx = -dx;
  
    if (y + dy < 0) {
      dy = -dy;
    } else if (y + dy > height - paddleh) {
      // check if the ball is hitting the 
      // paddle and if it is rebound it
      if (x > paddlex && x < paddlex + paddlew) {
        dy = -dy;
      }
    }
   if (y + dy > height) {
      //game over, so stop the animation
      stop_animation();
    }
    x += dx;
    y += dy;
  } 

  function start_animation() {
    intervalId = setInterval(draw, 10);
  }
  
  function stop_animation() {
    clearInterval(intervalId);
  }


 
  // // initialize game
  // function init() {
  //   //get a reference to the canvas
  //   let canvas = canvasRef.current;
  //   if (!canvas) return;
  //   ctx = canvas.getContext("2d");
  //   width = $("#canvas").width();
  //   height = $("#canvas").height();
  //   paddlex = width / 2;
  //   brickWidth = (width/ncols) - 1;
  //   canvasMinX = $("#canvas").offset().left;
  //   canvasMaxX = canvasMinX + width;
  //   score = 0;
  //   // run draw function every 10 milliseconds to give 
  //   // the illusion of movement
  //   init_bricks();
  //   start_animation();
  // }

 

  // // used to draw the ball
  // function circle(x: number, y: number , ballRadius: number) {
  //   ctx.beginPath();
  //   ctx.arc(x, y, ballRadius, 0, Math.PI*2, true);
  //   ctx.closePath();
  //   ctx.fill();
  // }

  

  // // clear the screen in between drawing each animation
  // function clear() {
  //   ctx.clearRect(0, 0, width, height);
  //   rect(0,0,width,height);
  // }

  // // What do to when the mouse moves within the canvas
  // function onMouseMove(evt) {
  //   // set the paddle position if the mouse position 
  //   // is within the borders of the canvas
  //   if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
  //     paddlex = Math.max(evt.pageX - canvasMinX - (paddlew/2), 0);
  //     paddlex = Math.min(width - paddlew, paddlex);
  //   }
  // }

  // function onKeyPress(evt) {
  //   evt.preventDefault();
  //   pause()
    
  // }

  // function pause() {
  //   if (paused) { // if paused, begin animation again
  //     start_animation();
  //   } else { // if unpaused, clear the animation
  //     stop_animation();
  //   }
  //   paused = !paused;
  // }

  // // initialize array of bricks to be visible (true)
  // function init_bricks() {
  //     bricks = new Array(nrows);
  //     for (i=0; i < nrows; i++) { // for each row of bricks
  //         bricks[i] = new Array(ncols);
  //         for (j=0; j < ncols; j++) { // for each column of bricks
  //             bricks[i][j] = true;
  //         }
  //     }
  // }

  

  // function draw() {
  //   // before drawing, change the fill color
  //   ctx.fillStyle = backcolor;
  //   clear();
  //   ctx.fillStyle = ballcolor;
  //   //draw the ball
  //   circle(x, y, ballRadius);
  //   ctx.fillStyle = paddlecolor;
  //   //draw the paddle
  //   rect(paddlex, height-paddleh, paddlew, paddleh);
  //   draw_bricks();

  //   //check if we have hit a brick
  //   rowheight = brickHeight + padding;
  //   colwidth = brickWidth + padding;
  //   row = Math.floor(y/rowheight);
  //   col = Math.floor(x/colwidth);
  //   //if so reverse the ball and mark the brick as broken and add 1 to score
  //   if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
  //     dy = -dy;
  //     bricks[row][col] = false;
  //     score ++;
  //     update_score_text()
  //   }
  
  //   //contain the ball by rebouding it off the walls of the canvas
  //   if (x + dx > width || x + dx < 0)
  //     dx = -dx;

  //   if (y + dy < 0) {
  //     dy = -dy;
  //   } else if (y + dy > height - paddleh) {
  //     // check if the ball is hitting the 
  //     // paddle and if it is rebound it
  //     if (x > paddlex && x < paddlex + paddlew) {
  //       dy = -dy;
  //     }
  //   }
  // if (y + dy > height) {
  //     //game over, so stop the animation
  //     stop_animation();
  //   }
  //   x += dx;
  //   y += dy;
  // } 

  // // Function to update the player's score and save it to local storage
  // function update_score_text() {
  //   // You can send data to your HTML
  //   // just like setting styles in CSS
  //   // Put <div id="score"></div> in
  //   // your HTML for this text to display
  //   $('#score').text("Score: " + score);
  // }

  // function start_animation() {
  //   intervalId = setInterval(draw, 10);
  // }

  // function stop_animation() {
  //   clearInterval(intervalId);
  // }


    // // Create array grid to hold bricks
  // function init_bricks() {
  //   let bricks = new Array(brickGridData.nrows);
  //   for (let i=0; i < brickGridData.nrows; i++) { // for each row of bricks
  //     bricks[i] = new Array(brickGridData.ncols);
  //     for (let j=0; j < brickGridData.ncols; j++) { // for each column of bricks
  //       bricks[i][j] = true;
  //     }
  //   }
  //   return bricks;
  // }

  // // draws the bricks 
  // function draw_bricks() {
  //   let bricks = init_bricks();
  //   for (let i=0; i < brickGridData.nrows; i++) { // for each row of bricks
  //     for (let j=0; j < brickGridData.ncols; j++) { // for each column of bricks
  //       if (canvasRef.current) {
  //         canvasCtxRef.current = canvasRef.current.getContext('2d');
  //         let ctx = canvasCtxRef.current
  //         // set the colors to alternate through
  //         // all colors in brick_colors array
  //         // modulus (%, aka remainder) ensures the colors
  //         // rotate through the whole range of brick_colors
  //         ctx!.fillStyle = brickData.colors[(i+j) % brickData.colors.length];
  //         if (bricks[i][j]) {
  //           rect(brickData.x, brickData.y, brickData.width, brickData.height)
  //         }
  //       } // else if bricks[i][j] is false it's already been hit
  //     }
  //   }
  // }

  const moveBall = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // wall collsions
    if (
      ball.x + ball.ballRadius > canvasWidth ||
      ball.x - ball.ballRadius < 0
    ) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.ballRadius < 0) {
      ball.dy = -ball.dy;
    }
    if (ball.y + ball.ballRadius > canvasHeight) {
      setGameStarted(true);
      setGameLost(false);
    }

    // paddle collision
    if (
      ball.y > paddle.y &&
      ball.x < paddle.x + paddle.width &&
      ball.x > paddle.x
    ) {
      ball.dy = -ball.speed;
      ball.dx += paddle.dx * 0.2;
    }

    // brick collision
    for (let brick of bricks) {
      if (brick.isVisible) {
        if (
          ball.x > brick.x && // left
          ball.x < brick.x + brick.width && // right
          ball.y - ball.ballRadius < brick.y + brick.height && // down
          ball.y + ball.ballRadius > brick.y // top
        ) {
          ball.dy = -ball.dy;
          brick.isVisible = false;
          setScore(score + 1);
        }
      }
    }
  };

  const movePaddle = () => {
    paddle.x += paddle.dx;

    // wall collsions
    if (paddle.x < 0) {
      paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvasWidth) {
      paddle.x = canvasWidth - paddle.width;
    }
  }

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (gameStarted) {
      moveBall();
      movePaddle();
    }

    ctx!.clearRect(0, 0, canvasWidth, canvasHeight);

    draw_ball();
    draw_paddle();
    draw_bricks();

    requestAnimationFrame(update);
  };


  const moveBall = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // wall collsions
    if (
      ball.x + ball.ballRadius > canvasWidth ||
      ball.x - ball.ballRadius < 0
    ) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.ballRadius < 0) {
      ball.dy = -ball.dy;
    }
    if (ball.y + ball.ballRadius > canvasHeight) {
      setGameStarted(true);
      setGameLost(false);
    }

    // paddle collision
    if (
      ball.y > paddle.y &&
      ball.x < paddle.x + paddle.width &&
      ball.x > paddle.x
    ) {
      ball.dy = -ball.speed;
      ball.dx += paddle.dx * 0.2;
    }

    // brick collision
    for (let brick of bricks) {
      if (brick.isVisible) {
        if (
          ball.x > brick.x && // left
          ball.x < brick.x + brick.width && // right
          ball.y - ball.ballRadius < brick.y + brick.height && // down
          ball.y + ball.ballRadius > brick.y // top
        ) {
          ball.dy = -ball.dy;
          brick.isVisible = false;
          setScore(score + 1);
        }
      }
    }
  };

  const movePaddle = () => {
    paddle.x += paddle.dx;

    // wall collsions
    if (paddle.x < 0) {
      paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvasWidth) {
      paddle.x = canvasWidth - paddle.width;
    }
  }

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (gameStarted) {
      moveBall();
      movePaddle();
    }

    ctx!.clearRect(0, 0, canvasWidth, canvasHeight);

    draw_ball();
    draw_paddle();
    draw_bricks();

    requestAnimationFrame(update);
  };