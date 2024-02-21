/* constants */
const gameBoardContainer = document.querySelector('.game-board-container');
const playButton = document.querySelector('.btn-play');
const setupForm = document.getElementById('setupForm');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
/* state variables (initialise in function */
let gameOver = false;
let isWinner = null;
let score;
let timer;
let difficulty; //this will also be set at game setup - here for testing
let mapWidth;
let mapHeight;
let mapArray = [];
let minesArray = [];

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
    mapArray[x][y].value = 'mine';
  }
};

const setDifficulty = difficulty => {
  switch (difficulty) {
    case 'easy':
      mapWidth = mapX = 5;
      mapHeight = mapY = 5;
      totalMines = 6;
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
  flaggedMines = totalMines;
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

/* making space to work oin the recurive element only */

const checkMap = (x, y) => {
  perimterCellsArr = perimeterCells(x, y);
  let neighborMineCount = 0;
  for (cell of perimterCellsArr) {
    if (mapArray[cell[0]][cell[1]].value === 'mine') neighborMineCount++;
  }
  //assign value to the current cell in the state variable
  mapArray[x][y].value = neighborMineCount;
  switch (neighborMineCount) {
    case 1:
      updateCell(x, y, '/img/cell-1.png');
      break;
    case 2:
      updateCell(x, y, '/img/cell-2.png');
      break;
    case 3:
      updateCell(x, y, '/img/cell-3.png');
      break;
    case 4:
      updateCell(x, y, '/img/cell-4.png');
      break;
    case 5:
      updateCell(x, y, '/img/cell-5.png');
      break;
    case 6:
      updateCell(x, y, '/img/cell-6.png');
      break;
    default:
      updateCell(x, y, '/img/cleared-cell.png');
  }
};

/* END OF RECURSIVE ELEMENT WORK  */

const updateCell = (x, y, image) => {
  console.log('this function will update the board for the requested cell');
  cellToUpdate = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  const imgElement = cellToUpdate.children[0];
  imgElement.src = image;
};

const handleBoardRightClick = e => {
  e.preventDefault();
  const x = e.target.parentElement.getAttribute('data-x');
  const y = e.target.parentElement.getAttribute('data-y');
  console.log(e.target.getAttribute('src'));
  if (e.target.getAttribute('src') === '/img/flag-cell.png') {
    mapArray[x][y].flagged = false;
    e.target.src = '/img/blank-cell.png';
  } else {
    mapArray[x][y].flagged = true;
    e.target.src = '/img/flag-cell.png';
  }
};

const handleBoardLeftClick = e => {
  e.preventDefault();
  const x = e.target.parentElement.getAttribute('data-x');
  const y = e.target.parentElement.getAttribute('data-y');
  //console.log(`x: ${x} y:${y}`);
  selectedCell = mapArray[x][y];
  //do initial check for mine in this left clicked cell
  if (selectedCell.value === 'mine') {
    e.target.src = '/img/mine-cell.png';
    isWinner = false;
    gameOver = true; // not sure I need this - work out later how to stop the game
  } else {
    // here we trigger the checkMap to check the map recursively
    checkMap(x, y);
  }
  //checkCells(mapArray[selectedCellIdx]); // LATER
};

const perimeterCells = (xCoord, yCoord) => {
  //console.log(`checking perimeter cells of ${xCoord}, ${yCoord}`);
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
      //console.log(`Cell is out of bounds ${arr}`);
      continue;
    } else {
      filteredPerimeterCells.push(arr);
    }
  }
  return filteredPerimeterCells;
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

/* event listeners */

setupForm.addEventListener('submit', initialiseGame);

// listening for left and right clicks on the board
gameBoardContainer.addEventListener('click', e => {
  handleBoardLeftClick(e);
});

gameBoardContainer.oncontextmenu = e => {
  handleBoardRightClick(e);
};
