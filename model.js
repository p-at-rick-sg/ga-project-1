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
  const mineCount = minesArray.length ?? 0;
  // Base case
  if (minesArray.length === totalMines) {
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

const updateCellState = (x, y, option) => {
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
