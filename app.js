/* constants */
const gameBoardContainer = document.querySelector('.game-board-container');
const playButton = document.querySelector('.btn-play');
const setupForm = document.getElementById('setupForm');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const resultAlert = document.querySelector('.alert');
const resultScore = document.querySelector('.score');
const resultWinner = document.querySelector('.winner');
const mineCounter = document.querySelector('.mine-counter');
const allContentDiv = document.querySelector('.all-content');

/* state variables */
let gameOver = false;
let score;
let timer;
let difficulty;
let flaggedMines = 0;
let mapWidth;
let mapHeight;
let mapArray = [];
let minesArray = [];

/* functions */

// TODO setup local file to store high scores

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
      mapArray[row][cell] = {flagged: false, checked: false, value: null};
    }
  }
  return mapArray;
};

const createMines = minesArray => {
  const mineCount = minesArray.length ?? 0; // checking for the  initial case to we don't break on startup
  // Base case
  if (minesArray.length === totalMines) {
    console.log(minesArray);
    return minesArray;
  }
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

const addMinesToMap = (mapArray, mineArr) => {
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
      gameBoardContainer.style.width = '130px';
      break;
    case 'medium':
      mapWidth = mapX = 10;
      mapHeight = mapY = 10;
      totalMines = 20;
      gameBoardContainer.style.width = '254px';
      break;
    case 'hard':
      mapWidth = mapX = 20;
      mapHeight = mapY = 20;
      totalMines = 40;
      gameBoardContainer.style.width = '504px';
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
  updateFlagCounter(0);
  // create the boad and render it
  mapArray = createMapArray(mapWidth);
  minesArray = createMines([]);
  addMinesToMap(mapArray, minesArray);
  renderRowElements(mapHeight);
  renderColumnElements(mapArray);
};

const tmpZeroCells = []; //testing with this outside is working - maybe can work out how top retuirn this with the cell values instead as it would be neater
const floodRecursion = cellArr => {
  console.log('the flooding recursive function start line');

  // BASE CASE - ALL NEIGHBOURS ARE CHECKED (and maybe we end up back at the start?)
  if (cellArr === undefined) {
    console.log('hit the base case');
    return 0;
  }
  const perimeterCellsArr = checkForPerimeterCells(cellArr);
  console.log('unchecked vaid perimeter cells: ' + perimeterCellsArr);
  for (cell of perimeterCellsArr) {
  }
  //check each unchecked perimeter cell for value
  perimeterCellsArr.forEach(cell => {
    [x, y] = cell;
    //we get the valid perimeter cells for the perimeter cell
    const tmpPerimeterCellsArr = checkForPerimeterCells(cell);
    // get the value for that cell
    const tmpCellValue = checkPerimeterMineValue(tmpPerimeterCellsArr, cellArr);
    //update stage and UI
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(tmpCellValue)) {
      updateCellState(x, y, tmpCellValue);
      updateCellUI(x, y, tmpCellValue);
      //we don't add to the next to check array as we have a value and we don't check value cells
    } else if (tmpCellValue === 0) {
      // set the cell state and UI then call the recursive function
      updateCellState(x, y, tmpCellValue);
      updateCellUI(x, y, tmpCellValue);
      //add this cellArr to the tmpZeroCells array
      tmpZeroCells.push(cell);
    }
  });
  //now I need to call the recursion again with a value from the tmpZeroCells array which sits outside in order to track properly
  const nextCell = tmpZeroCells.pop();
  floodRecursion(nextCell);
};

/* END OF RECURSIVE ELEMENT WORK  */

const checkForPerimeterCells = cellArr => {
  //checking for all valid cells (not OOB) we need mines as we need to count them
  const x = Number(cellArr[0]);
  const y = Number(cellArr[1]);
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
    if (
      arr[0] < 0 ||
      arr[1] < 0 ||
      arr[0] > mapWidth - 1 ||
      arr[1] > mapHeight - 1 ||
      mapArray[arr[0]][arr[1]].checked === true
    ) {
      continue;
    } else {
      filteredPerimeterCells.push(arr);
    }
  }
  return filteredPerimeterCells;
};

const checkPerimeterMineValue = (cellsArr, currentCell) => {
  let neighborMineCount = 0;
  for (cell of cellsArr) {
    if (mapArray[cell[0]][cell[1]].value === 'mine') {
      neighborMineCount++;
      console.log(`cell: ${cell} was logged as a mine`);
    }
  }
  return neighborMineCount;
};

const updateCellUI = (x, y, option) => {
  console.log('updating UI');
  cellToUpdate = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  const imgElement = cellToUpdate.children[0];
  switch (option) {
    case 1:
      imgElement.src = '/img/cell-1.png';
      cellToUpdate.disabled = true;
      break;
    case 2:
      imgElement.src = '/img/cell-2.png';
      cellToUpdate.disabled = true;
      break;
    case 3:
      imgElement.src = '/img/cell-3.png';
      cellToUpdate.disabled = true;
      break;
    case 4:
      imgElement.src = '/img/cell-4.png';
      cellToUpdate.disabled = true;
      break;
    case 5:
      imgElement.src = '/img/cell-5.png';
      cellToUpdate.disabled = true;
      break;
    case 6:
      imgElement.src = '/img/cell-6.png';
      cellToUpdate.disabled = true;
      break;
    case 'mine':
      imgElement.src = '/img/mine-cell.png';
      cellToUpdate.disabled = true;
      break;
    default:
      imgElement.src = '/img/cleared-cell.png';
      cellToUpdate.disabled = true;
  }
};

const updateCellState = (x, y, option) => {
  console.log('updaing state');
  cellToUpdate = mapArray[x][y];
  switch (option) {
    case 1:
      cellToUpdate.value = 1;
      cellToUpdate.checked = true;
      break;
    case 2:
      cellToUpdate.value = 2;
      cellToUpdate.checked = true;
      break;
    case 3:
      cellToUpdate.value = 3;
      cellToUpdate.checked = true;
      break;
    case 4:
      cellToUpdate.value = 4;
      cellToUpdate.checked = true;
      break;
    case 5:
      cellToUpdate.value = 5;
      cellToUpdate.checked = true;
      break;
    case 6:
      cellToUpdate.value = 6;
      cellToUpdate.checked = true;
      break;
    case 'mine':
      cellToUpdate.value = 'mine';
      cellToUpdate.checked = true;
      break;
    default:
      cellToUpdate.value = 0;
      cellToUpdate.checked = true;
  }
};

const updateFlagCounter = (flagged, total = 6) => {
  console.log('flag counter func running');
  //calculate the number of mines flagged
  mineCounter.innerText = `${flagged} of ${totalMines} mines Flagged`;
};

const handleBoardRightClick = e => {
  e.preventDefault();
  const x = e.target.parentElement.getAttribute('data-x');
  const y = e.target.parentElement.getAttribute('data-y');
  if (e.target.getAttribute('src') === '/img/flag-cell.png') {
    mapArray[x][y].flagged = false;
    e.target.src = '/img/blank-cell.png';
    flaggedMines--;
  } else {
    mapArray[x][y].flagged = true;
    e.target.src = '/img/flag-cell.png';
    flaggedMines++;
  }
  updateFlagCounter(flaggedMines);
};

const handleBoardLeftClick = e => {
  e.preventDefault();
  const x = e.target.parentElement.getAttribute('data-x');
  const y = e.target.parentElement.getAttribute('data-y');
  const selectedCell = mapArray[x][y];
  //do initial check for mine in this left clicked cell
  if (selectedCell.value === 'mine') {
    //call the board update function to show all mines
    for (cell of minesArray) {
      updateCellState(cell.x, cell.y, 'mine');
      updateCellUI(cell.x, cell.y, 'mine');
    }
    isWinner = false;
    handleGameOver(isWinner, 100); //will add score here later if I have time
    return 0;
  }
  // check if the cell is a number and then return to the game
  cellArr = [x, y];
  perimeterCellsArr = checkForPerimeterCells(cellArr);
  const cellValue = checkPerimeterMineValue(perimeterCellsArr, cellArr);
  //if the value is in the range 1-9 then reveal the cell and exit
  if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(cellValue)) {
    updateCellState(x, y, cellValue);
    updateCellUI(x, y, cellValue);
    return 0;
  } else if (cellValue === 0) {
    // set the cell state and UI then call the recursive function
    updateCellState(x, y, cellValue);
    updateCellUI(x, y, cellValue);
    floodRecursion(cellArr);
  }
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
      allRowDivs[
        row
      ].innerHTML += `<div class="col btn-cell" data-x="${row}" data-y="${cell}"><img src="/img/blank-cell.png"></div>`;
    }
  }
};

// <div class="col btn-cell" data-x="${row}" data-y="${cell}><img src="/img/blank-cell.png"></div>

const handleGameOver = (winner, score) => {
  let winText = '';
  if (winner === true) {
    winText = 'WINNER';
  } else {
    winText = 'LOSER';
  }
  console.log(winText);
  resultAlert.innerText = `You are a: ${winText} this time`;
  resultAlert.style.display = 'block';
  setTimeout(() => {
    console.log('Delayed for 5 seconds.');
    resultAlert.style.display = 'none';
    clearBoard();
  }, '5000');
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
