/*  --------------
 *   | Variables |
 *  --------------
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

/*  -------------
 *  | Functions |
 *  -------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");
    
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    document.addEventListener("keydown", keyboardHandler);

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

/*  --------------
 *  | Snake Func |
 *  --------------
 */

function snakeInitialize() {
    snake = [];
    snakeLength = 5;
    snakeSize = 20;
    snakeDirection = "down";
    
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
    
    if(snakeDirection === "down") {
        snakeHeadY++;
    }
    else if(snakeDirection === "up") {
        snakeHeadY--;
    }
    else if(snakeDirection === "left") {
        snakeHeadX--;
    }
    else if(snakeDirection === "right") {
        snakeHeadX++;
    }
    
    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/*  --------------
 *  | Food Func  |
 *  --------------
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    
    food.x = randomX;
    food.y = randomY;
}

function keyboardHandler(event) {
    console.log(event);
    
    if(event.keyCode == "39") {
        snakeDirection = "right";
    }
    else if(event.keyCode == "37") {
        snakeDirection = "left";
    }
    else if(event.keyCode == "38") {
        snakeDirection = "up";
    }
    else if (event.keyCode == "40") {
        snakeDirection = "down";
    }
}


/*
 *  -----------------------------------------------------------
 * |                     THE GAME                            |
 * -----------------------------------------------------------
 */
gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000/30);

