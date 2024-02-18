/* constants */
const gameBoardContainer = document.querySelector('.game-board-container');
const playButton = document.querySelector('.btn-play');
// console.log(gameBoardContainer);
/* state variables (initialise in function */
let inPlay;
let isWinner;
let score;
let timer;
const totalMines = 10; //this will also be set at game setup - here for testing
const mapWidth = 5; //this  and height will be set by thr user in game setup in final
const mapHeight = 5;
//const mapArray = [];  need to check the scope of this as we may need to declare globally if i need it outside of initialise
var mapX = mapWidth; // use for itteration
var mapY = mapHeight;
// const minesArray = []; //testing 1,1 values

/* cached DOM elements (such as the baord innerHTML perhaps) */

/* functions */

// TODO setup database connection and object for high scores

const createMapArray = mapArr => {
  //base case - both x and y have gone to 0
  if (mapX === 0) {
    //console.log(`Hit the base case: mapX is: ${mapX}`);
    mapArr.pop();
    return mapArr;
  }
  //recursion cases
  if (mapY > 0) {
    newCellObj = {x: mapX, y: mapY, mine: false, cleared: false, adjacent: 0};
    mapY -= 1;
    return createMapArray([...mapArr, newCellObj]);
  }
  if (mapY === 0 && mapX !== 0) {
    mapY = mapWidth;
    mapX -= 1;
    //console.log(`In the NEW row loop and mapY is: ${mapY} and mapX is ${mapX}`);
    newCellObj = {x: mapX, y: mapY, mine: false, cleared: false, adjacent: 0};
    mapY -= 1;
    return createMapArray([...mapArr, newCellObj]);
  }
};

const createMineMapCoords = minesArray => {
  const mineCount = minesArray.length ?? 0; // checking for the  initial case to we don't break on startup
  // Base case
  if (minesArray.length === totalMines) return minesArray;
  // recursion case
  const x = Math.floor(Math.random() * mapWidth + 1);
  const y = Math.floor(Math.random() * mapHeight + 1);
  //console.log(`x: ${x} and y: ${y} height: ${mapHeight}`);
  const newCoord = {x: x, y: y};
  // logic to check for duplicates
  const preExisting = minesArray.some(coord => {
    if (coord.x === x && coord.y === y) {
      return true;
    }
    return false;
  });
  //console.log(preExisting); // check if the exact element already exists - if it does, return without adding
  return preExisting
    ? createMineMapCoords([...minesArray])
    : createMineMapCoords([...minesArray, newCoord]);
  //return createMineMapCoords([...minesArray, newCoord]);
};

const initialiseGame = () => {
  // TODO setup the game
  mapArray = createMapArray([]);
  minesArray = createMineMapCoords([]);
  renderInitialBoard(mapArray);
};

/* event listeners */

playButton.addEventListener('click', initialiseGame);

gameBoardContainer.addEventListener('click', () => {
  console.log('Game board container was clicked');
});

const renderRowElements = numRows => {
  for (let i = 1; i <= numRows; i++) {
    gameBoardContainer.innerHTML += `<div class="row row-${i}"></div>`;
  }
};

const renderInitialBoard = arr => {
  const NEW_ROW_START = `<div class="row">`;
  const NEW_ROW_END = `</div>`;
  const boardCells = [];
  let i = arr.length - 1;
  for (i; i >= 0; i--) {
    const cell = arr[i];
    if (cell.y === 1) {
      gameBoardContainer.innerHTML += NEW_ROW_START;
      boardCells.push(NEW_ROW_START);
    }
    newCell = `<div class="col-sm" data-id="${cell.x}-${cell.y}">CL</div>`;
    gameBoardContainer.innerHTML += newCell;
    // cache the cell to an array we can return
    boardCells.push(newCell);
    if (cell.y === 5) {
      gameBoardContainer.innerHTML += NEW_ROW_END;
      boardCells.push(NEW_ROW_END);
    }
  }
  return boardCells;
};
