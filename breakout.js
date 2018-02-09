var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

var moveLeft = undefined,
    moveRight = undefined;

function handleKeyDown (e) {
  if ( e.which === 37 ) {
    moveLeft = true;
  } else if ( e.which === 39 ) {
    moveRight = true;
  }

}

function handleKeyUp (e) {
  if ( e.which === 37 ) {
    moveLeft = false;
  } else if ( e.which === 39 ) {
    moveRight = false;
  }

}

function handlePaddleMovement () {
  if ( moveLeft && paddle.x > 0) {
    paddle.x -= 10;
  } else if ( moveRight &&  paddle.x < canvas.width - paddle.width ) {
    paddle.x += 10;
  }
}
var ball = {
  x: canvas.width/2,
  y: canvas.height-50,
  size: 10,
  radius: 10/2,
  dx: 5,
  dy: 5
};

var brick = {
  x: 0,
  y: 0,
  width: 100,
  height: 10,
  padding: 10,
  style: "red",
  columns: 8,
  rows: 6,
  count: 0
};

var brickCords = [];

function generateBrickCords () {
  for ( var r = 1; r < brick.rows; r++) {
    brickCords[r] = [];
    for ( var c = 1; c < brick.columns; c++ ) {
      brickCords[r][c] = { x: 0, y: 0, status: 1};
    }
  }
}
generateBrickCords();

function drawBricks () {

   for ( var r = 1; r < brick.rows; r++) {

     for ( var c = 1; c < brick.columns; c++ ) {
      if ( brickCords[r][c].status === 1 ) {
         var brickX = (r * (brick.width + brick.padding) + brick.padding);
         var brickY = (c * (brick.height + brick.padding) + brick.padding);
         brickCords[r][c].x = brickX;
         brickCords[r][c].y = brickY;
         ctx.beginPath();
         ctx.rect(brickX, brickY, brick.width, brick.height);
         ctx.fillStyle = brick.style;
         ctx.fill();
         ctx.closePath();
       }


     }
   }
}

function collisionDetection() {
  var win = (brick.rows - 1) * (brick.columns - 1)
  for ( r = 1; r < brick.rows; r++) {
    for ( c = 1; c < brick.columns; c++) {
      var b = brickCords[r][c];

      if ( ball.x > b.x && ball.x  < b.x + brick.width &&
           ball.y > b.y && ball.y  < b.y + brick.height && b.status === 1 ) {
             ball.dy = - ball.dy;
             b.status = 0;
             paddle.score++;
             if ( paddle.score === win) {
               alert("You won");
               ball.dy = 0;
               ball.dx = 0;
               document.location.reload();
             }
           }
    }
  }
}

function drawBall () {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, false);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function ballMovement() {
  ball.x += ball.dx;
  ball.y -= ball.dy;
  if ( ball.x + ball.size > canvas.width ) {
    ball.dx = - ball.dx;
  } else if (ball.y - ball.size < 0 ) {
    ball.dy = - ball.dy;
  } else if ( ball.x - ball.size < 0 ) {
    ball.dx = - ball.dx;
  } else if ( ball.y + ball.size > canvas.height - paddle.height ) {
     if ( ball.x > paddle.x && ball.x < paddle.x + paddle.width ) {
       ball.dy = - ball.dy;
     } else if ( ball.y - ball.size > canvas.height ) {
       ball.dx = 0;
       ball.dy = 0;
       alert("YOU LOST");
       document.location.reload();
     }

  }
}



var paddle = {
  x: canvas.width/2 - 50,
  y: canvas.height - 10,
  width: 100,
  height: 10,
  score: 0
};

function drawPaddle () {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function drawScore () {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+paddle.score, 8, 20);
}



function game () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  collisionDetection();
  handlePaddleMovement();
  drawBricks();
  drawScore();
  ballMovement();
  drawBall();

  window.requestAnimationFrame(game);
}

game();
