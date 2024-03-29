/* constants */
const gameBoardContainer = document.querySelector('.game-board-container');
const playButton = document.querySelector('.btn-play');
const setupForm = document.getElementById('setup-form');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const resultAlert = document.querySelector('.alert');
const resultScore = document.querySelector('.score');
const resultWinner = document.querySelector('.winner');
const mineCounter = document.querySelector('.mine-counter');
const allContentDiv = document.querySelector('.all-content');
const timeDisplay = document.querySelector('.game-timer');

const diffDiv = document.querySelector('.set-diff');

/* state variables */
let gameOver = false;
let isWinner = null;
let score = 0;
let difficulty;
let flaggedMines = 0;
let mapWidth;
let mapHeight;
let mapArray = [];
let minesArray = [];
let timer;
const defaultTimers = [60, 180, 300];

/* MAIN GAME FUNCTIONALITY */
const initialiseGame = e => {
  clearBoard();
  gameBoardContainer.style = 'pointer-events: auto';
  for (const radioButton of difficultyRadios) {
    if (radioButton.checked) {
      difficulty = radioButton.value;
      break;
    }
  }
  timer = timeSlider.value;
  e.preventDefault();
  setDifficulty(difficulty);
  updateFlagCounter(0);
  startTimer();
  // create the boad and render it
  mapArray = createMapArray(mapWidth);
  minesArray = createMines([]);
  addMinesToMap(mapArray, minesArray);
  renderRowElements(mapHeight);
  renderColumnElements(mapArray);
};

const startTimer = () => {
  stopWatch = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(stopWatch);
      handleGameOver(false, 0);
    }
    const secs = timer % 60;
    const mins = Math.floor(timer / 60);
    timeDisplay.innerText = `${mins}:${secs}`;
  }, 1000);
};

const tmpZeroCells = []; //testing with this outside is working - maybe can work out how top retuirn this with the cell values instead as it would be neater
const floodRecursion = cellArr => {
  // BASE CASE
  if (cellArr === undefined) {
    return 0;
  }
  const perimeterCellsArr = checkForPerimeterCells(cellArr);
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
    }
  }
  return neighborMineCount;
};

const handleBoardRightClick = e => {
  e.preventDefault();
  const x = e.target.parentElement.getAttribute('data-x');
  const y = e.target.parentElement.getAttribute('data-y');
  //adding the logic to not flag checked cells
  if (e.target.getAttribute('src') === '/img/flag-cell.png' && mapArray[x][y].checked !== true) {
    mapArray[x][y].flagged = false;
    e.target.src = '/img/blank-cell.png';
    flaggedMines--;
  } else if (mapArray[x][y].checked !== true) {
    mapArray[x][y].flagged = true;
    e.target.src = '/img/flag-cell.png';
    flaggedMines++;
  } else {
    return 0;
  }
  updateFlagCounter(flaggedMines);
  const hasWon = checkForWin();
  if (hasWon) handleGameOver(hasWon, timer);
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
    handleGameOver(isWinner, timer);
    return 0;
  }
  // check if the cell is a number and then return to the game
  cellArr = [x, y];
  perimeterCellsArr = checkForPerimeterCells(cellArr);
  const cellValue = checkPerimeterMineValue(perimeterCellsArr, cellArr);
  //if the value is in the range 1-9 then reveal the cell and exit
  if ([1, 2, 3, 4, 5, 6, 7, 8].includes(cellValue)) {
    updateCellState(x, y, cellValue);
    updateCellUI(x, y, cellValue);
  } else if (cellValue === 0) {
    // set the cell state and UI then call the recursive function
    updateCellState(x, y, cellValue);
    updateCellUI(x, y, cellValue);
    floodRecursion(cellArr);
  }
  //check for win status
  const hasWon = checkForWin();
  if (hasWon) handleGameOver(hasWon, timer);
};

const checkForWin = () => {
  const flatArray = [].concat(...mapArray);
  winCheck1 = flatArray.filter(cell => {
    return cell.value === 'mine' && cell.flagged === true;
  });
  winCheck2 = flatArray.filter(cell => {
    return cell.checked === true;
  });
  winCheck1.length + winCheck2.length === flatArray.length ? (win = true) : (win = false);
  return win; //flatten the array, check that all mines are flagged, then check that all other cells are checked
};

const handleGameOver = (winner, remainingTime) => {
  clearInterval(stopWatch);
  gameBoardContainer.style = 'pointer-events: none';
  if (winner) {
    score = calculateScore(remainingTime);
  } else score = 0;
  let winText = '';
  if (winner === true) {
    winText = 'WINNER';
  } else {
    winText = 'LOSER';
  }
  resultAlert.innerText = `You are a: ${winText} this time. Your Score Was: ${score}`;
  resultAlert.style.display = 'block';
  playButton.disabled = true;
  saveScore(score);
  setDifficulty(difficulty);
  //do the local storage score thing here
  setTimeout(() => {
    resultAlert.style.display = 'none';
    playButton.disabled = false;
    clearBoard();
  }, '5000');
};

const calculateScore = remainingTm => {
  return totalMines * remainingTm;
};

const saveScore = currScore => {
  let scoreArray = [];
  if (currScore !== 0) {
    if (localStorage.getItem('msScores') !== null) {
      let strScores = localStorage.getItem('msScores');
      scoreArray = JSON.parse(strScores);
    }
    scoreArray.push(currScore);
    scoreArray.sort((a, b) => b - a);
    let strNewScores = JSON.stringify(scoreArray);
    localStorage.setItem('msScores', strNewScores);
  }
};

/* event listeners */

diffDiv.addEventListener('click', getDifficulty);

setupForm.addEventListener('submit', initialiseGame);

// listening for left and right clicks on the board
gameBoardContainer.addEventListener('click', e => {
  handleBoardLeftClick(e);
});

gameBoardContainer.oncontextmenu = e => {
  handleBoardRightClick(e);
};
