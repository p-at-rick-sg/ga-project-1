window.onload = updateScoreUI = () => {
  let scoreArray = [];
  if (localStorage.getItem('msScores') !== null) {
    console.log('found existing scores and pulling then in ');
    let strScores = localStorage.getItem('msScores');
    scoreArray = JSON.parse(strScores);
    scoreArray.sort((a, b) => b - a);
  }
  const scoreTable = document.querySelector('.score-table');
  for (score of scoreArray) {
    scoreTable.innerHTML += `<tr><td>${score}</td></tr>`;
  }
};

const clearBoard = () => {
  mapArray.length = 0;
  gameBoardContainer.innerHTML = '';
  timeDisplay.innerHTML = '';
  return 0;
};
