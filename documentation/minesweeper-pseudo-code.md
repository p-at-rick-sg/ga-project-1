**Connect 4 Pseudo Code**

_Structure_
The application will be plit into 3 files - app.js (controller), ui.js (view) and data.js (model) as per the MVC guidelines.

**Game Selection**
Connect to the database to retrieve the leaderboard data
Render the main screen items to the home screen
Set the listeners for the difficulty level, timer and start and reset buttons

**Game Setup**
Build the board based on the options selected above
Easy: 8 _ 8 board with 5 mines - configure only this model first
Medium: 12 _ 12 board with 10 mines
Hard: 15 \* 15 board with 20 mines

1. Create an game array to hold the game state {x: n, y: n, mine: bool, cleaerd: bool, adjacent: n}
2. Each map cell will be 1 object as above
3. Using recursion based on width and height of the board, create the array:

function (x, y) {
  base case:
  if (x = 0 and y = 0)
  return
  else:
  create new object and pass back the new x and y numbers
}


2. Create random locations for the mines
   1. check the mines are not too close/overlapping
   2. Add data to the board array
3. Initialise the game instance with mine mine/no-mine | flagged | cleared)
4. Loop or a recursive function to build the board and display on the page using <div> elements

Game Play
Setup listeners for:

- left-click on the game board
  - attempts to "sweep" the clicked location
  - If there is no mine, then it will recursively check each adjacent location until it reaches a location that has an adjacent mine
  - Mark each of these locations with a number representing the adjacent bombs
  - If there is a mine, the game is over and the board detonates
- right-click on the game board
  - flags the location in the game state
  - updates the grid item with a flag icon
  - Updates the flags counter on the screen
- ctrl-click on the game board
  - safe-detonates the location clicked
  - if there was a bomb is is removed from the game state and the user it notified of a controlled explosion & the bomb counter is updated to reflect 1 less bomb available
  - removes 30 seconds from the game counter

Once all locations are either flagged or cleared, the game is complete

Reset button will clear the current game and trigger a new game instance to be setup and displayed

Completion
Failure:

- Try again message appears to the user
  Success:
- The players score is calculated and displayed.
- An input form is displayed for the user to enter their details
- Saved details will be stored in the noSQL database to drive the leaderboard data
