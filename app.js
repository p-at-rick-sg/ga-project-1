//TODO Setup the game constants
let inPlay = false;
let isWinner = false;
let score = 0;
let timer = 0;
let totalMines = 0;
mapWidth = 5;
mapHeight = 5;
var mapX = mapWidth;
var mapY = mapHeight;




const createMapArray = (mapArray) => {
  //base case - both x and y have gone to 0
  if ( mapX === 0 ) {
    console.log(`Hit the base case: mapX is: ${mapX}`);
    mapArray.pop();
    return mapArray;
  }

  if (mapY > 0 ) {
    console.log(`In the standard row loop and mapY is: ${mapY} and mapX is ${mapX}`)
    newCellObj = {x: mapX, y: mapY, mine: false, cleared: false, adjacent: 0};
    mapY -= 1;
    return createMapArray([...mapArray, newCellObj])
  }
  if (mapY === 0  && mapX !== 0) {
    mapY = mapWidth;
    mapX -= 1;
    console.log(`In the NEW row loop and mapY is: ${mapY} and mapX is ${mapX}`);
    newCellObj = {x: mapX, y: mapY, mine: false, cleared: false, adjacent: 0};
    mapY -= 1;
    return createMapArray([...mapArray, newCellObj])
  }
}








const createMineMapCoords = () => {
  // TODO create random locations for the mines
};

const initialise = () => {
  // TODO setup the game
};

//TODO add event listeners

const render = () => {
  // TODO
};


//Test Calls
