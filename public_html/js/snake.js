// BUG 1! (fixed) Game Over Screen is not quite centered
// fix 1: set fixed size for element called by "gameOverMenu"
// opt 1: made element size responsive to overall window size (500px or 200px)
// 
// BUG 2! (fixed) Game screen stays the same after window resizing
// fix 2: canvas width and height are now set in looping gameDraw function
// 
// BUG 3! (fixed) Window can be resized such that food is off-screen
// fix 3: added a check to gameLoop function that resets position of food
//        if food is found to be off-screen
// BUG 4! Snake can change directions twice before position is updated
// fix 4: disabled movment after each keypress and re-enabled after each
//        position update
// BUG 5! (fixed) Food is sometimes drawn on top of snake body
// fix 5: added a function to test upcoming food vs. current snake position
// fix 5: added food vs. snake position check to setFoodPosition function

/*  -------------
 *  | Variables |
 *  -------------
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;
var snakeMovement;

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

function playBeep() {
        var beep = new Audio("sounds/beep.mp3");
        beep.play();
}

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
    
    if (gameState === "gameover") {
        centerMenuPosition(gameOverMenu); // needed here for responsive design
        // "Game Over" manu will remain centered while window is resized
    }
    
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
    snakeDirection = "right";
    
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
        snakeMovement="enabled"; // see notes in keyboardHandler()
        // allow snake to change directions once position has been updated once
    }
    else if (snakeDirection === "up") {
        snakeHeadY--;
        snakeMovement="enabled"; // see notes in keyboardHandler()
    }
    else if (snakeDirection === "left") {
        snakeHeadX--;
        snakeMovement="enabled"; // see notes in keyboardHandler()
    }
    else if (snakeDirection === "right") {
        snakeHeadX++;
        snakeMovement="enabled"; // see notes in keyboardHandler()
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
    // debugging: check that food drawn on snake is properly detected
    // console.log(foodIsNotOnSnake(food.x, food.y));
    setFoodPosition();
}

function foodDraw() {
    context.fillStyle = "red";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
    
    var randomX, randomY;
    var foodPosOK = false; // ensure Random XY is generated at least once
    
    while (foodPosOK === false) {
        console.log("Generating Random XY for Food.");
        randomX = Math.floor(Math.random() * screenWidth / snakeSize);
        randomY = Math.floor(Math.random() * screenHeight / snakeSize);
        foodPosOK = foodIsNotOnSnake(randomX, randomY);
    }
        food.x = Math.floor(randomX);
        food.y = Math.floor(randomY);
}

function foodIsNotOnSnake(testFoodX, testFoodY) {
    for (var i = 0; i < snake.length; i++) {
        // for debugging, show the snake array values to be checked
        console.log("checking snake segment: " + i);
        console.log("Food X, Y: " + testFoodX + ", " + testFoodY);
        console.log("Snake X, Y: " + snake[i].x + ", " + snake[i].y);
        
        // return false if food would be drawn on snake body
        if (testFoodX === snake[i].x && testFoodY === snake[i].y) {
            console.log("Food Will Be Drawn Onto Snake Body");
            return false;
        }
    }
    // return true if food will not be drawn on snake body
    console.log("Food Will Not Be Drawn On Snake Body");
    return true;
}

/*  ==============================================
 *                  Input Functions
 *  ==============================================
 */ 

function keyboardHandler(event) {

    // disabled movement after each key to prevent sudden reversing of direction
    // it was previously possible to change directions twice before
    // the snake position had updated. For example, while going right
    // the player could press up and quickly left, allowing the snake
    // to head left before heading up, causing a snake collision and
    // ending the game (when segments below 5 were checked for collisions)
    
    if ((event.keyCode === 39 || event.keyCode === 68)
        && snakeDirection !== "left" && snakeMovement !== "disabled") {
        console.log("RIGHT key detected");
        snakeDirection = "right";
        snakeMovement="disabled";
    }
    else if ((event.keyCode === 37 || event.keyCode === 65)
        && snakeDirection !== "right" && snakeMovement !== "disabled") {
        console.log("LEFT key detected");
        snakeDirection = "left";
        snakeMovement="disabled";
    }
    else if ((event.keyCode === 38 || event.keyCode === 87)
        && snakeDirection !== "down" && snakeMovement !== "disabled") {
        console.log("UP key detected");
        snakeDirection = "up";
        snakeMovement="disabled";
    }
    else if ((event.keyCode === 40 || event.keyCode === 83)
        && snakeDirection !== "up" && snakeMovement !== "disabled") {
        console.log("DOWN key detected");
        snakeDirection = "down";
        snakeMovement="disabled";
    }
}

/* ===================================================
 *                Collsion Handling
 *  ==================================================
 */

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
   for(var i = 5; i < snakeLength; i++) {
       // starting at segment 5 because segments 1 - 4
       // should never be able to collide if properly on-grid
       if (snakeHeadX === snake[i].x && snakeHeadY === snake[i].y) {
           console.log("Snake Collision Detected");
           console.log("snake body x: " + snake[i].x);
           console.log("snake body y: " + snake[i].y);
           console.log("snake head x: " + snakeHeadX);
           console.log("snake head y: " + snakeHeadY);
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
    centerMenuPosition(gameOverMenu);
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
    if (window.innerWidth > 500) {
    menu.style.width = "500px";
    }
    else if (window.innerWidth > 200) {
        menu.style.width = "200px";
    }
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
setInterval(gameLoop, 1000/20);

