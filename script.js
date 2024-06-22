const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");

let box;
let rows;
let columns;
let speed = 175;
const margin = 100; // Abstand von einem Zentimeter in Pixel (10px)

let snake;
let food;
let score;
let direction;
let game;
let highscore = localStorage.getItem("highscore") || 0;

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0 && direction !== "RIGHT") {
      direction = "LEFT";
    } else if (xDiff < 0 && direction !== "LEFT") {
      direction = "RIGHT";
    }
  } else {
    if (yDiff > 0 && direction !== "DOWN") {
      direction = "UP";
    } else if (yDiff < 0 && direction !== "UP") {
      direction = "DOWN";
    }
  }

  xDown = null;
  yDown = null;
}

function startGame() {
  resizeCanvas();
  startButton.style.display = "none";
  restartButton.style.display = "none";
  highscoreDisplay.textContent = highscore;
  resetGame();
  game = setInterval(draw, speed);
}

function restartGame() {
  clearInterval(game);
  startGame();
}

function resizeCanvas() {
  const availableWidth = window.innerWidth - 2 * margin;
  const availableHeight = window.innerHeight - 2 * margin;

  canvas.width = availableWidth;
  canvas.height = availableHeight;

  box = Math.floor(Math.min(availableWidth, availableHeight) / 20);
  rows = Math.floor(availableHeight / box);
  columns = Math.floor(availableWidth / box);
}

window.addEventListener("resize", resizeCanvas);

function resetGame() {
  resizeCanvas();
  snake = [];
  snake[0] = {
    x: Math.floor(columns / 2) * box,
    y: Math.floor(rows / 2) * box,
  };
  food = {
    x: Math.floor(Math.random() * columns) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
  score = 0;
  scoreDisplay.textContent = score;
  direction = null;
}

function changeDirection(event) {
  if (event.keyCode === 37 && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (event.keyCode === 38 && direction !== "DOWN") {
    direction = "UP";
  } else if (event.keyCode === 39 && direction !== "LEFT") {
    direction = "RIGHT";
  } else if (event.keyCode === 40 && direction !== "UP") {
    direction = "DOWN";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "red";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = score;
    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore);
      highscoreDisplay.textContent = highscore;
    }
    food = {
      x: Math.floor(Math.random() * columns) * box,
      y: Math.floor(Math.random() * rows) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    restartButton.style.display = "block";
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

resizeCanvas();
