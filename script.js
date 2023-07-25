class Level {
  constructor(
    level,
    initialSpeed,
    speedIncrement,
    maxSpeed,
    winScore,
    obstacles,
    light,
    gridSize,
    snakeArray
  ) {
    this.level = level;
    this.initialSpeed = initialSpeed;
    this.speedIncrement = speedIncrement;
    this.maxSpeed = maxSpeed;
    this.winScore = winScore;
    this.obstacles = obstacles;
    this.light = light;
    this.gridSize = gridSize;
    this.snakeArray = snakeArray;
  }
}
let levels = [];
resetLevels();

function resetLevels() {
  levels = [
    new Level(1, 125, 25, 125, 20, 0, 1, 6, [3, 2, 1]),
    new Level(2, 180, 40, 20, 20, 0, 1, 30, [3, 2, 1]),
    new Level(3, 125, 50, 25, 10, 30, 1, 16, [55, 54, 53]),
  ];
}

let snakeDirection = "right";
let obstacleArray = [];
let gameState = false;
let score = 0;
let foodOnBoard = false;
let numberOfObstacles;
function generateBoardArray(gridSize) {
  let tempArray = [];

  for (let i = 0; i < gridSize * gridSize; i++) {
    tempArray.push(i);
  }

  return tempArray;
}

function generateBoard(boardArray, level) {
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < boardArray.length; i++) {
    let divElement = document.createElement("div");
    if (level.snakeArray.includes(i)) {
      divElement.classList.add("tile", "S");
      divElement.id = i;
      fragment.appendChild(divElement);
    } else {
      divElement.classList.add("tile", "E");
      divElement.id = i;
      fragment.appendChild(divElement);
    }
  }

  let gameContainer = document.querySelector(".game-container");
  gameContainer.style.gridTemplateColumns = `repeat(${level.gridSize}, 1fr)`;
  gameContainer.style.gridTemplateRows = `repeat(${level.gridSize}, 1fr)`;
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild);
  }

  gameContainer.appendChild(fragment);
}

const startGame = function (level) {
  generateBoard(generateBoardArray(level.gridSize), level);
  const startEl = document.querySelector(".start-game-area");
  startEl.style.visibility = "hidden";
  gameState = true;
  spawnFood(level);
  gameLoop(level);
};

function calculateBorders(gridSize) {
  let leftBorder = [0];
  let rightBorder = [];
  let rightBorderBlockID = gridSize - 1;
  let leftBorderBlockID = gridSize;
  for (let i = 0; i < gridSize; i++) {
    rightBorder.push(rightBorderBlockID);
    rightBorderBlockID += gridSize;
    leftBorder.push(leftBorderBlockID);
    leftBorderBlockID += gridSize;
  }

  return [leftBorder, rightBorder];
}

function calculateNextTileID(gridSize, leftBorder, rightBorder, snakeArray) {
  let tileID = -1;
  if (snakeDirection === "right" && rightBorder.includes(snakeArray[0])) {
    tileID = snakeArray[0] - gridSize + 1;
  } else if (snakeDirection === "left" && leftBorder.includes(snakeArray[0])) {
    tileID = snakeArray[0] + gridSize - 1;
  } else if (snakeDirection === "up" && snakeArray[0] < gridSize) {
    tileID = gridSize * (gridSize - 1) + snakeArray[0];
  } else if (
    snakeDirection === "down" &&
    snakeArray[0] > gridSize * (gridSize - 1) - 1
  ) {
    tileID = snakeArray[0] % gridSize;
  } else if (snakeDirection === "right") {
    tileID = snakeArray[0] + 1;
  } else if (snakeDirection === "left") {
    tileID = snakeArray[0] - 1;
  } else if (snakeDirection === "down") {
    tileID = snakeArray[0] + gridSize;
  } else if (snakeDirection === "up") {
    tileID = snakeArray[0] - gridSize;
  } else {
    alert("ERROR");
  }

  console.log(tileID);
  return tileID;
}

function handleNextTile(tileID, level) {
  let tempElement = document.getElementById(tileID);
  if (tempElement.classList.contains("E")) {
    level.snakeArray.unshift(tileID);
    document.getElementById(level.snakeArray.pop()).className = "tile E";
    tempElement.className = "tile S";
  } else if (tempElement.classList.contains("S")) {
    gameState = false;
  } else if (tempElement.classList.contains("F")) {
    level.snakeArray.unshift(tileID);
    tempElement.className = "tile S";
    foodOnBoard = false;

    level.initialSpeed -= level.speedIncrement;
    level.initialSpeed = Math.max(level.initialSpeed, level.maxSpeed);
    score += 1;
  }
}

function spawnFood(level) {
  let state = true;
  while (state) {
    let randomInt = getRandomIntInclusive(
      0,
      level.gridSize * level.gridSize - 1
    );
    if (!level.snakeArray.includes(randomInt)) {
      const foodElement = document.getElementById(randomInt);
      foodElement.className = "tile F";
      foodOnBoard = true;
      state = false;
    }
  }
}

function spawnObstacle() {}

function flickerLight() {}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

let directionChanged = false;
document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;

    if (event.key === "ArrowUp") {
      if (snakeDirection !== "down" && !directionChanged) {
        snakeDirection = "up";
        directionChanged = true; // Set the flag to true
      }
    } else if (event.key === "ArrowDown") {
      if (snakeDirection !== "up" && !directionChanged) {
        snakeDirection = "down";
        directionChanged = true; // Set the flag to true
      }
    } else if (event.key === "ArrowLeft") {
      if (snakeDirection !== "right" && !directionChanged) {
        snakeDirection = "left";
        directionChanged = true; // Set the flag to true
      }
    } else if (event.key === "ArrowRight") {
      if (snakeDirection !== "left" && !directionChanged) {
        snakeDirection = "right";
        directionChanged = true; // Set the flag to true
      }
    }
    console.log(snakeDirection);
  },
  false
);

function gameLoop(level) {
  if (!gameState) {
    alert("Game Over");
    return;
  }

  directionChanged = false;
  borders = calculateBorders(level.gridSize);
  setTimeout(() => {
    if (!foodOnBoard) {
      spawnFood(level);
    }
    handleNextTile(
      calculateNextTileID(
        level.gridSize,
        borders[0],
        borders[1],
        level.snakeArray
      ),
      level
    );
    gameLoop(level);
  }, level.initialSpeed);
}
