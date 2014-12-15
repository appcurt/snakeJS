/*  -------------
 *  | Variables |
 *  -------------
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;
var canvas;

var gameState;
var gameOverMenu;
var restartButton;

/*  ------------------
 *  | Game Functions |
 *  ------------------
 */

function gameInitialize() {
    canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");
    
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    document.addEventListener("keydown", keyboardHandler);
    
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    
    setState("play");
}

function gameLoop() {
    gameDraw();
    if (gameState === "play") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
        // fix for bug: screen can be resized such that
        // food goes off the screen and is inaccessible
        if (food.x > (screenWidth / snakeSize) 
         || food.y > (screenHeight / snakeSize)) {
            setFoodPosition();
        }
    }
}

function gameDraw() {
    // Make the game responsive to Window Resizing
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    centerMenuPosition(gameOverMenu);
    
    // Draw the background of the game
    context.fillStyle = "rgb(100,190,200)";
    context.fillRect(0, 0, screenWidth, screenHeight);
    
}

function gameRestart() {
    hideMenu(gameOverMenu);
    snakeInitialize();
    foodInitialize();
    setState("play");
    
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
    
    if (snakeDirection === "down") {
        snakeHeadY++;
    }
    else if (snakeDirection === "up") {
        snakeHeadY--;
    }
    else if (snakeDirection === "left") {
        snakeHeadX--;
    }
    else if (snakeDirection === "right") {
        snakeHeadX++;
    }
    
    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);
    
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
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    
    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}

/*  ==============================================
 *                  Input Functions
 *  ==============================================
 */ 

function keyboardHandler(event) {
    console.log(event);
    
    if ((event.keyCode === 39 || event.keyCode === 68) && snakeDirection !== "left") {
        snakeDirection = "right";
    }
    else if ((event.keyCode === 37 || event.keyCode === 65) && snakeDirection !== "right") {
        snakeDirection = "left";
    }
    else if ((event.keyCode === 38 || event.keyCode === 87) && snakeDirection !== "down") {
        snakeDirection = "up";
    }
    else if ((event.keyCode === 40 || event.keyCode === 83) && snakeDirection !== "up") {
        snakeDirection = "down";
    }
}

function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX === food.x && snakeHeadY === food.y) {
        console.log("Food Collision Detected");
        
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
        setFoodPosition();
    }
}

/* ===================================================
 *                Collsion Handling
 *  ==================================================
 */

function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0) {
        console.log("Wall Collision: X Axis");
        setState("gameover");
    }
    if (snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
        console.log("wall Collision: Y Axis");
        setState("gameover");
    }        
}

function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
   for(var i = 1; i < snakeLength; i++) {
       if (snakeHeadX === snake[i].x && snakeHeadY === snake[i].y) {
           setState("gameover");
           return;
       }
   } 
}

function setState(state) {
    gameState = state;
    showMenu(state);
}

/* =====================================================
 *                 Menu Functions
 * =====================================================
 */

function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state) {
    if (state === "gameover") {
        displayMenu(gameOverMenu);
    }
}

function centerMenuPosition(menu) {
    menu.style.width = "500px"; // fix later to dynamically assign
    menu.style.top = ((screenHeight / 2) - (menu.offsetHeight)) + "px";
    menu.style.left = ((screenWidth / 2) - (menu.offsetWidth / 2)) + "px";
}
/*
 * -----------------------------------------------------------
 * |                     THE GAME                            |
 * -----------------------------------------------------------
 */
gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000/25);

