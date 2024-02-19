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
const totalMines = 10; //this will also be set at game setup - here for testing
const mapWidth = 5; //this  and height will be set by thr user in game setup in final
const mapHeight = 5;
//const mapArray = [];  need to check the scope of this as we may need to declare globally if i need it outside of initialise
var mapX = mapWidth; // use for itteration purposes only
var mapY = mapHeight;
// const minesArray = []; //testing 1,1 values

/* cached DOM elements (such as the baord innerHTML perhaps) */

/* functions */

// TODO setup database connection and object for high scores

const createMapArray = mapArr => {
  //base case - both x and y have gone to 0
  //console.log(mapX, mapY);
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

const initialiseGame = () => {
  // TODO setup the game
  mapArray = createMapArray([]);
  console.log(mapArray);
  minesArray = createMineMapCoords([]);
  console.log(minesArray);
  renderRowElements(mapHeight);
  renderColumnElements(mapArray);
};

/* event listeners */

setupForm.addEventListener(
  'submit',
  e => {
    for (const radioButton of difficultyRadios) {
      if (radioButton.checked) {
        difficulty = radioButton.value;
        break;
      }
    }
    e.preventDefault();
  },
  false
);

playButton.addEventListener('click', initialiseGame);

gameBoardContainer.addEventListener('click', () => {
  console.log('Game board container was clicked');
});

const renderRowElements = numRows => {
  for (let i = 1; i <= numRows; i++) {
    gameBoardContainer.innerHTML += `<div class="row row-cols-${numRows} row-${i}"></div>`;
  }
};

const renderColumnElements = cellArr => {
  // split the cell array into muktiople row arrays and order them correctly
  const cellsInRows = [];
  for (i = 0; i < mapHeight; i++) {
    cellsInRows[i] = cellArr.filter(cell => cell.x === i + 1).reverse();
  }
  // get the child arrays of the board container
  const allRowDivs = gameBoardContainer.childNodes;
  //loop the rows and add the child cell elements
  allRowDivs.forEach((currentRow, rowIdx) => {
    cellsInRows[rowIdx].forEach((currentCell, cellIdx) => {
      currentRow.innerHTML += `<button type="button" class="col btn btn-light">CL</button>`;
    });
  });

  // currentRow.innerHTML += `<button type="button" class="col btn btn-light">CL</button>`;

  //return boardCells;
};

// currentRow.innerHTML += `<button type="button" class="col btn btn-light">CL${cellArr[i].x}</button>`;

// <div class="container text-center">
//       <div class="row row-cols-3">
//         <button type="button" class="col btn btn-light">CL1</button>
//         <button type="button" class="col btn btn-light">CL2</button>
//         <button type="button" class="col btn btn-light">CL3</button>
//       </div>
//       <div class="row row-cols-3">
//         <button type="button" class="col btn btn-light">CL4</button>
//         <button type="button" class="col btn btn-light">CL5</button>
//         <button type="button" class="col btn btn-light">CL6</button>
//       </div>
//       <div class="row row-cols-3">
//         <button type="button" class="col btn btn-light">CL7</button>
//         <button type="button" class="col btn btn-light">CL9</button>
//         <button type="button" class="col btn btn-light">CL9</button>
//       </div>
//     </div>
