# ga-project-1

Project 1 for GA SEI Intake

Deliverables:

- Completed code that works and meets the requirements
- README.md File (you are in it already)
- Link to the published game: https://https://minesweeper.rick.sg/
- **Game: Minesweeper**

_Background_ Minesweeper was first implemented in Windows 95. The game consists of a grid of squares
that have random mines concealed. The players objective is to mark the mines and clear the ones that
are not mines. They are assisted by numbers representing the number of mines in neoghbour cells when
they clear them.

If a mine is clicked, the game is over nad the player loses. If the timer ends, the game is over and
the player loses. Player wins by marking all mines and clearing all non-mine grid items.

**Screenshot(s):**

![Minesweeper Screenshot](/documentation/game-start.png 'Minesweeper Screenshot')
![Minesweeper Flooded Cells](/documentation/flooded-cells.png 'Minesweeper Screenshot')
![Minesweeper Flooded Cells](/documentation/losing-screen.png 'Minesweeper Screenshot')

**Technologies Used**: The game is built purely in HTML, Javascript and CSS. I imported the
bootstrap CSS library for some basic styling

**Getting Started**:

Game setup is simple, selecting the difficulty level and the timer. There are default values for the
timer for each difficulty level. Game state is stored in a single array - the board state 2D array.
Cells in the UI have data attributes mapped that correspond to the array values (zero indexed) in an
x, y model.

**Next Steps**: Planned future enhancements (icebox items): - Make 1st move always be a clear cell.
(add logic to move the 1st cell mine if it's a hit anf then continue with the game) - 1 Free clear -
allow user to clear 1 cell and if it'a a mine they can continue, but with a reduced score or loss of
time - Replay previous games - save all actions and allow the user to replay them or review them.

- _Stretch goal_ - implement the game into node so that state can be sotred in a firebase or mongo
  db - then allow multi-player from separate devices
- _Stetch goal_ - Implement a cube map consisting of 6 sides
- Share the exact game board - add in a method to share a password protected set of arrays to a friend to challenge them.

**Major Challenges Encountered**

There were two major issues that I encoutnered during the creation of the game:

1. Game State Array: I initially used a 1D array to hold the game state and added the x and y values
   to the same object that stored the cell state. I spent a lot of time and lines of code pulling
   these values, looping through a lot of cells to find vaulues and moving them to temp variables to
   use them. After struggling with this for some time and adding a lot of code to the application, I
   made the tough decison to toally refactor the code and use a 2D array with the x and y values in
   the array indexes. This took some time but really helped in reducing the complexity of the code
   once complete.

Side note: I still have some inconsistency in passing cell values around between functions, either
x, y or [x, y] and conversions. Given more time i would ensure this is resolved and I use 1 method
only.

2. Flooding algorythm: I got stuck for nearly 2 days building this and getting it to work
   consistenty. I had to go back to basics and play an online game for some time to really
   understnad the logic properly again as I had missded a couple of important factors. However even
   then I had difficulty in stopping the flooding when it hit a numbered cell and not going beyond.
   I think 2 things helped me to resolve this:
1. I moved a lot of the logic for retrieving valid cells and mine values to external functions
1. I tracked the status of the unchecked cells outside of the recursion

I would try to change the way the recursive function works if given more timestarted over to take in
an array of cells to check in the first intannce and then I would not need to rely on the external
tracking.

**Lessons Learned**

1. Do more planning - I could have saved a lot of time if I had planned the logic better and
   completed a serious pseudo code session. This could have helped me to avoid the refactoring of
   the state array and also I think saved time on the flooding feature.
2. The 'little bits' you need to do like win logic and scoring take a lot more time than you expect.
   I spent a full day adding these and had not accounted for that.
3. Testing. Have a clear test plan and expected outcomes. Document what is a valid result and what
   is a failure/needs to be resolved.

**Test Plan** _Game Setup_

1. The user can select 3 diffuculty levels and the board renders accordingly
2. The user can update the default timer regardless of the difficulty level selected
3. The startt game button starts the game with the expected parameters
4. Player can right click any unchecked cell to flag it - if already flagged, they can remove the
   flag _BUG - player can add a flag to an already checked cell and this resets the cell - will fix
   if I have time!_
5. Player can select any unchecked cell to clear: if mine - gae over If note mine, relevant cells
   are cleared and updated
6. Game over logic works as expected: Once all mines are identified correctly and all other cells
   are cleared, player wins Selecting any mine cell for clearing results in loss Timer ending
   results in loss
7. Score saving: If scores are present in local storage, they are retrieved on loading and displayed
   If the player wins, the score is calculated, displayed and added to local storage
