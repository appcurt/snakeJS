var snake;
var snakeLength;
var snakeSize;

var food;

var context;
var screenWidth;
var screenHeight;

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");
    
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
}

function gameLoop() {
    gameDraw();
    snakeUpdate();
    snakeDraw();
    foodDraw();
}

function gameDraw() {
    context.fillStyle = "rgb(100,190,200)";
    context.fillRect(0, 0, screenWidth, screenHeight);
    
    snakeDraw();
}

function snakeInitialize() {
    snake = [];
    snakeLength = 5;
    snakeSize = 20;
    
    for(var i = snakeLength - 1; i >= 0; i--) {
        snake.push( {
            x: i,
            y: 0
        });
    }
}

function snakeDraw() {
    for(var i = 0; i < snake.length; i++) {
        context.fillStyle = "white";
        context.fillRect(snake[i].x * snakeSize, snake[i].y * snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;
    
    snakeHeadX++;
    
    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
}

function foodDraw() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, snakeSize, snakeSize);
}

gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000/30);