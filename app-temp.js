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
