/* constants */

/* state variables (initialise in function */
let inPlay;
let isWinner;
let score;
let timer;
const totalMines = 10; //this will also be set at game setup - here for testing
const mapWidth = 5; //this  and height will be set by thr user in game setup in final
const mapHeight = 5;
const mapArray = [];
var mapX = mapWidth; // use for itteration
var mapY = mapHeight;
const minesArray = [{x: 1, y: 1}]; //testing 1,1 values

/* cached DOM elements (such as the baord innerHTML perhaps) */

/* event listeners */

/* functions */

// TODO setup database connection and object for high scores

const createMapArray = mapArray => {
  //base case - both x and y have gone to 0
  if (mapX === 0) {
    console.log(`Hit the base case: mapX is: ${mapX}`);
    mapArray.pop();
    return mapArray;
  }
  //recursion cases
  if (mapY > 0) {
    console.log(
      `In the standard row loop and mapY is: ${mapY} and mapX is ${mapX}`
    );
    newCellObj = {x: mapX, y: mapY, mine: false, cleared: false, adjacent: 0};
    mapY -= 1;
    return createMapArray([...mapArray, newCellObj]);
  }
  if (mapY === 0 && mapX !== 0) {
    mapY = mapWidth;
    mapX -= 1;
    console.log(`In the NEW row loop and mapY is: ${mapY} and mapX is ${mapX}`);
    newCellObj = {x: mapX, y: mapY, mine: false, cleared: false, adjacent: 0};
    mapY -= 1;
    return createMapArray([...mapArray, newCellObj]);
  }
};

const createMineMapCoords = minesArray => {
  const mineCount = minesArray.length ?? 0; // checking for the  initial case to we don't break on startup
  // Base case
  if (minesArray.length === totalMines) return minesArray;

  // recursion case
  const x = Math.floor(Math.random() * mapWidth);
  const y = Math.floor(Math.random() * mapHeight);
  console.log(`x: ${x} and y: ${y} height: ${mapHeight}`);
  const newCoord = {x: x, y: y};
  // logic to check for duplicates
  const preExisting = minesArray.some(coord => {
    if (coord.x === x && coord.y === y) {
      return true;
    }
    return false;
  });
  console.log(preExisting);
  return preExisting
    ? createMineMapCoords([...minesArray])
    : createMineMapCoords([...minesArray, newCoord]);
  //return createMineMapCoords([...minesArray, newCoord]);
};

const initialise = () => {
  // TODO setup the game
};

//TODO add event listeners

const render = () => {
  // TODO add multiple render functions
  // renderBoard()
  // renderControls etc etc
};

//Testing Calls
