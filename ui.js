const sliderDisplay = document.querySelector('.slider-display');
const timeSlider = document.getElementById('time-slider');

window.onload = updateScoreUI = () => {
  let scoreArray = [];
  if (localStorage.getItem('msScores') !== null) {
    let strScores = localStorage.getItem('msScores');
    scoreArray = JSON.parse(strScores);
    scoreArray.sort((a, b) => b - a);
  }
  const scoreTable = document.querySelector('.score-table');
  for (i in scoreArray) {
    if (i < 10) scoreTable.innerHTML += `<tr><td>${scoreArray[i]}</td></tr>`;
  }
};

sliderDisplay.innerText = timeSlider.value;
timeSlider.oninput = function () {
  sliderDisplay.innerText = this.value;
};

const clearBoard = () => {
  mapArray.length = 0;
  gameBoardContainer.innerHTML = '';
  timeDisplay.innerHTML = '';
  return 0;
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

const getDifficulty = () => {
  for (const radioButton of difficultyRadios) {
    if (radioButton.checked) {
      switch (radioButton.value) {
        case 'easy':
          timeSlider.value = defaultTimers[0];
          sliderDisplay.innerText = defaultTimers[0];
          break;
        case 'medium':
          timeSlider.value = defaultTimers[1];
          sliderDisplay.innerText = defaultTimers[1];
          break;
        case 'hard':
          timeSlider.value = defaultTimers[2];
          sliderDisplay.innerText = defaultTimers[2];
          break;
      }
    }
  }
};

const updateCellUI = (x, y, option) => {
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

const updateFlagCounter = (flagged, total = 6) => {
  //calculate the number of mines flagged
  mineCounter.innerText = `${flagged} of ${totalMines} Mines`;
  if (flaggedMines > totalMines) {
    mineCounter.style.color = 'red';
    mineCounter.style.fontWeight = 'bold';
  } else {
    mineCounter.style.color = 'darkGrey';
    mineCounter.style.fontWeight = 'normal';
  }
};
