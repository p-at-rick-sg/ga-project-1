let mapArray = [];

const createMapArray = (width = 5) => {
  //creating with 2 layer array instead
  for (let xElement = 0; xElement < width; xElement++) {
    mapArray.push([]);
  }
  for (row in mapArray) {
    for (cell in mapArray) {
      mapArray[row][cell] = {flagged: false, value: null};
    }
  }
};

const addNeighborsToMap = () => {
  mapArray.forEach(cell => {
    if (cell.value === 'mine') {
      const centreX = cell.x;
      const centreY = cell.y;
      console.log(centreX + ' ' + centreY);
      for (let x = centreX - 1; x <= centreX + 1; x++) {
        for (let y = centreY - 1; y <= centreY + 1; y++) {
          if (x === centreX && y === centreY) {
            console.log('original cell');
          } else if (findCellIndex(mapArray, x, y) === 1000) {
            console.log('index value was 1000 to this is an out of bounds cell');
          } else if (mapArray[findCellIndex(mapArray, x, y)].value === 'mine') {
            console.log('neighbor is a mine to ignoring also');
          } else {
            // do the checks on these cells
            console.log(`add 1 to the value of cell ${x} ${y}`);
            mapArray[findCellIndex(mapArray, x, y)].value += 1;
          }
        }
      }
    }
  });
};

const checkMap = cellArr => {
  console.log(`currently checking cell: ${cellArr}`);
  if (cellArr === undefined) {
    console.log('hit the base case - undefined value was passed in');
    return; // Stop the recursion if undefined is passed in
  }

  perimeterCellsArr = perimeterCells(cellArr);
  let neighborMineCount = 0;

  for (cell of perimterCellsArr) {
    if (mapArray[cell[0]][cell[1]].value === 'mine') {
      neighborMineCount++;
      console.log(`cell: ${cell} was logged as a mine`);
    }
  }

  mapArray[cellArr[0]][cellArr[1]].value = neighborMineCount;
  updateCell(cellArr[0], cellArr[1], neighborMineCount);

  const uncheckedArr = [];
  let stopChecking = false; // Flag to indicate if we should stop checking

  for (cell of perimterCellsArr) {
    if (mapArray[cell[0]][cell[1]].value === 'unchecked') {
      uncheckedArr.push(cell);
      if (isNumber(mapArray[cell[0]][cell[1]].value)) {
        stopChecking = true; // Stop checking if we encounter a numbered cell
      }
    }
  }

  if (uncheckedArr.length === 0 || stopChecking) {
    return; // Stop the recursion if no unchecked cells are found or we encounter a numbered cell
  } else {
    const randIdx = Math.floor(Math.random() * uncheckedArr.length);
    return checkMap(uncheckedArr[randIdx]);
  }
};

// Function to check if a value is a number
const isNumber = value => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};
