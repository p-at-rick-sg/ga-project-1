/* constants */
const gameBoardContainer = document.querySelector('.game-board-container');
const playButton = document.querySelector('.btn-play');
const setupForm = document.getElementById('setupForm');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
/* state variables (initialise in function */
let inPlay;
let isWinner;
let score;
let timer;
let difficulty;
let totalMines; //this will also be set at game setup - here for testing
let mapWidth; //this  and height will be set by thr user in game setup in final
let mapHeight;
let mapArray = [];
let minesArray = [];
let mapX = mapWidth; // use for itteration purposes only
let mapY = mapHeight;

/* cached DOM elements (such as the baord innerHTML perhaps) */

/* functions */

// TODO setup database connection and object for high scores

const clearBoard = () => {
  // NOT WORKING - mapArray is not being generated after the first game
  //mapArray.length = 0;
  mapX = mapWidth;
  mapY = mapHeight;
  console.log('clearing rendered board');
  gameBoardContainer.innerHTML = '';
  return 0;
};

const createMapArray = mapArr => {
  //base case - both x and y have gone to 0
  if (mapX === 0) {
    //console.log(`Hit the base case: mapX is: ${mapX}`);
    mapArr.pop();
    return mapArr.reverse(); //easier to reverse here that rewrite the whole function to work upwards given the issues I had!
  }
  //recursion cases
  if (mapY > 0) {
    newCellObj = {x: mapX, y: mapY, value: null}; //values are null, clear, mine or adjacent mine #
    mapY -= 1;
    return createMapArray([...mapArr, newCellObj]);
  }
  if (mapY === 0 && mapX !== 0) {
    mapY = mapWidth;
    mapX -= 1;
    //console.log(`In the NEW row loop and mapY is: ${mapY} and mapX is ${mapX}`);
    newCellObj = {x: mapX, y: mapY, value: null};
    mapY -= 1;
    return createMapArray([...mapArr, newCellObj]); //try reversing this to get a correctly ordered array
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

const addMinesToMap = (mapArr, mineArr) => {
  console.log(mapArr, mineArr);
  //get each mines coordinates
  for (const mine of mineArr) {
    const x = mine.x;
    const y = mine.y;
    // lookup the cells array idx
    cellIdx = findCellIndex(mapArray, x, y);
    mapArray[cellIdx].value = 'mine';
  }
};

const setDifficulty = difficulty => {
  switch (difficulty) {
    case 'easy':
      mapWidth = mapX = 5;
      mapHeight = mapY = 5;
      totalMines = 10;
      break;
    case 'medium':
      mapWidth = mapX = 10;
      mapHeight = mapY = 10;
      totalMines = 20;
      break;
    case 'hard':
      mapWidth = mapX = 20;
      mapHeight = mapY = 20;
      totalMines = 40;
      break;
  }
};

const initialiseGame = e => {
  clearBoard();
  for (const radioButton of difficultyRadios) {
    if (radioButton.checked) {
      difficulty = radioButton.value;
      break;
    }
  }
  //console.log(difficulty);  // need this later for the setting of the
  e.preventDefault();
  setDifficulty(difficulty);
  // create the boad and render it
  mapArray = createMapArray([]);
  minesArray = createMineMapCoords([]);
  addMinesToMap(mapArray, minesArray);
  renderRowElements(mapHeight);
  renderColumnElements(mapArray);
};

const handleBoardRightClick = e => {
  e.preventDefault();
  const x = e.target.getAttribute('data-x');
  const y = e.target.getAttribute('data-y');
  console.log(`x: ${x} y:${y}`);
};

const handleBoardLeftClick = e => {
  e.preventDefault();
  const x = e.target.getAttribute('data-x');
  const y = e.target.getAttribute('data-y');
  //console.log(`x: ${x} y:${y}`);
  // get this for the update of the state array
  selectedCellObj = findCellIndex(mapArray, x, y);
  //check if the cell is a mine if yes - set isWinner to false
  checkForMine(minesArray, x, y);
};

// func to find the index of a cell in the array using x,y coords
const findCellIndex = (arr, x, y) => {
  idx = arr.findIndex(obj => obj.x == x && obj.y == y);
  return idx;
};

const checkForMine = (arr, x, y) => {
  if (arr.find(obj => obj.x == x && obj.y == y)) {
    console.log('hit');
  } else {
    console.log('miss');
  }
};

/* event listeners */

setupForm.addEventListener('submit', initialiseGame);

// listening for left and right clicks on the board
gameBoardContainer.addEventListener('click', e => {
  handleBoardLeftClick(e);
});

gameBoardContainer.oncontextmenu = e => {
  handleBoardRightClick(e);
};

const renderRowElements = numRows => {
  for (let i = 1; i <= numRows; i++) {
    gameBoardContainer.innerHTML += `<div class="row row-cols-${numRows} row-${i}"></div>`;
  }
};

const renderColumnElements = cellArr => {
  // split the cell array into muktiople row arrays and order them correctly
  const cellsInRows = [];
  for (i = 0; i < mapHeight; i++) {
    cellsInRows[i] = cellArr.filter(cell => cell.x === i + 1);
  }
  // get the child arrays of the board container
  const allRowDivs = gameBoardContainer.childNodes;
  //loop the rows and add the child cell elements
  allRowDivs.forEach((currentRow, rowIdx) => {
    cellsInRows[rowIdx].forEach((currentCell, cellIdx) => {
      currentRow.innerHTML += `<button type="button" class="col btn btn-light" data-x="${currentCell.x}" data-y="${currentCell.y}">X: ${currentCell.x} Y:${currentCell.y}</button>`;
    });
  });
  //return boardCells;
};
