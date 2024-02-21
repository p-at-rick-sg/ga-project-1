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
let mapWidth;
let mapHeight;
let mapArray = [];
let minesArray = [];
let mapX = mapWidth; // use for itteration purposes only
let mapY = mapHeight;

/* functions */

// TODO setup database connection and object for high scores

const clearBoard = () => {
  mapArray.length = 0;
  gameBoardContainer.innerHTML = '';
  return 0;
};

const createMapArray = width => {
  //creating with 2 layer array instead of more complex objects
  for (let xElement = 0; xElement < width; xElement++) {
    mapArray.push([]);
  }
  for (row in mapArray) {
    for (cell in mapArray) {
      mapArray[row][cell] = {flagged: false, value: null};
    }
  }
  return mapArray;
};

const createMines = minesArray => {
  const mineCount = minesArray.length ?? 0; // checking for the  initial case to we don't break on startup
  // Base case
  if (minesArray.length === totalMines) return minesArray;
  // recursion case
  const x = Math.floor(Math.random() * mapWidth);
  const y = Math.floor(Math.random() * mapHeight);
  const newCoord = {x: x, y: y};
  // logic to check for duplicates
  const preExisting = minesArray.some(coord => {
    if (coord.x === x && coord.y === y) {
      return true;
    }
    return false;
  });
  // check if the exact element already exists - if it does, return without adding
  return preExisting ? createMines([...minesArray]) : createMines([...minesArray, newCoord]);
};

const addMinesToMap = (mapArr, mineArr) => {
  //get each mines coordinates
  for (const mine of mineArr) {
    const x = mine.x;
    const y = mine.y;
    //console.log(`x: ${x} y:${y}`);
    mapArray[x][y].value = 'mine';
  }
};

const setDifficulty = difficulty => {
  switch (difficulty) {
    case 'easy':
      mapWidth = mapX = 5;
      mapHeight = mapY = 5;
      totalMines = 8; //changed back after testing the neighbor f
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

/* MAIN GAME FUNCTION */
const initialiseGame = e => {
  clearBoard();
  for (const radioButton of difficultyRadios) {
    if (radioButton.checked) {
      difficulty = radioButton.value;
      break;
    }
  }
  e.preventDefault();
  setDifficulty(difficulty);
  // create the boad and render it
  mapArray = createMapArray(mapWidth);
  minesArray = createMines([]);
  addMinesToMap(mapArray, minesArray);
  renderRowElements(mapHeight);
  renderColumnElements(mapArray);
  // addNeighborsToMap();
  // console.log(mapArray);
};

const handleBoardRightClick = e => {
  e.preventDefault();
  const x = e.target.parentElement.getAttribute('data-x');
  const y = e.target.parentElement.getAttribute('data-y');
  console.log(e.target.getAttribute('src'));
  if (e.target.getAttribute('src') === '/img/flag-cell.png') {
    console.log('already a flag');
    e.target.src = '/img/blank-cell.png';
  } else {
    e.target.src = '/img/flag-cell.png';
  }
  console.log(`x: ${x} y:${y}`);
};

//

const handleBoardLeftClick = e => {
  e.preventDefault();
  const x = e.target.parentElement.getAttribute('data-x');
  const y = e.target.parentElement.getAttribute('data-y');
  //console.log(`x: ${x} y:${y}`);
  selectedCell = mapArray[x][y];
  console.log('checking for mine in cell');
  if (selectedCell.value === 'mine') {
    e.target.src = '/img/mine-cell.png';
    isWinner = false;
    inPlay = false; // not sure I need this - work out later how to stop the game
  } else {
    checkCells(x, y);
  }
  //checkCells(mapArray[selectedCellIdx]); // LATER
};

const checkCells = (xCoord, yCoord) => {
  console.log(`checking perimeter cells of ${xCoord}, ${yCoord}`);
  const x = Number(xCoord);
  const y = Number(yCoord);
  const permiterCellsArr = [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];
  const filteredPerimeterCells = [];
  for (arr of permiterCellsArr) {
    if (arr[0] < 0 || arr[1] < 0 || arr[0] > mapWidth - 1 || arr[1] > mapHeight - 1) {
      console.log(`Cell is out of bounds ${arr}`);
      continue;
    } else {
      filteredPerimeterCells.push(arr);
    }
  }
  console.log(filteredPerimeterCells);
};

const renderRowElements = numRows => {
  for (let i = 1; i <= numRows; i++) {
    gameBoardContainer.innerHTML += `<div class="row row-cols-${numRows} row-${i}"></div>`;
  }
};

const renderColumnElements = cellArr => {
  // get the child arrays of the board container
  const allRowDivs = gameBoardContainer.childNodes;
  //loop the rows and add the child cell elements
  for (row in allRowDivs) {
    for (cell in cellArr[row]) {
      //console.log(`row idx: ${row} and cell idx: ${cell}`);
      allRowDivs[
        row
      ].innerHTML += `<button type="button" class="col btn btn-cell" data-x="${row}" data-y="${cell}" ><img src="/img/blank-cell.png" /></button>`;
    }
  }
};

// `<button type="button" class="col btn btn-cell" data-x="${row}" data-y="${cell}" >${row}, ${cell}</button>`;

/* event listeners */

setupForm.addEventListener('submit', initialiseGame);

// listening for left and right clicks on the board
gameBoardContainer.addEventListener('click', e => {
  handleBoardLeftClick(e);
});

gameBoardContainer.oncontextmenu = e => {
  handleBoardRightClick(e);
};
