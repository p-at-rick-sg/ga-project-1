**Minesweeper Pseudo Code**

_Structure_ The application will be plit into 3 files - app.js (controller), ui.js (view) and
data.js (model) as per the MVC guidelines.

**Game Selection** Connect to the local storage to retrieve the top scores data if any. User selects
difficulty and timer. Render the main screen items to the home screen Set the listeners for the
difficulty level, timer and start button.

**Game Setup** Build the board model based on the options selected above

- Create an game array to hold the game state {x: n, y: n, mine: bool, cleaerd: bool, adjacent: n}
  Easy: 8 _ 8 board with 5 mines - configure only this model first Medium: 12 _ 12 board with 10
  mines Hard: 15 \* 15 board with 20 mines

Render the game:

1.
2. Each map cell will be 1 object as above

function (x, y) { base case: if (x = 0 and y = 0) return else: create new object and pass back the
new x and y numbers }

2. Create random locations for the mines
   1. check the mines are not repeated values/overlapping
   2. Add data to the board array
3. Initialise the game instance with mine mine/no-mine | flagged | cleared)
4. Loop or a recursive function to build the board and display on the page using
   <div> elements

Game Play Setup listeners for:

- left-click on the game board
  - attempts to "sweep" the clicked location
  - If there is no mine, then it will recursively check each adjacent location until it reaches a
    location that has an adjacent mine
  - Mark each of these locations with a number representing the adjacent bombs
  - If there is a mine, the game is over and the board detonates
- right-click on the game board
  - check for cell flag status
  - update flag value of the cell in the game state
  - updates the UI cell item with a flag icon/remove the flag icon
  - Updates the flags counter in state and on the screen counter

Once all locations are either flagged or cleared, the game is complete

Reset button will clear the current game and trigger a new game instance to be setup and displayed

Win Logic:

- After clicking any cell, check for win or loss if all mines flagged corrently and all other cells
  cleared - WIN if any mine is cleared - LOSE if timer ends - LOSE
- The players score is calculated and displayed for 5 seconds
- Saved details will be stored in thelocal storage to drive the high score data display.
