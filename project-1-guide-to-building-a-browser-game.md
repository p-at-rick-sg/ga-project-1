<img src="https://i.imgur.com/QBi5aLq.png">

# Guide on How to Build a Browser Game

## Intro

Getting started and knowing how to structure the code in an application is one of the most difficult things for students to figure out.

Also, there might be plenty of sources available to learn about how to use a `forEach` loop, but finding help on how to think like a developer and write code to implement an app's features is difficult at best.

Luckily, you've come to the right place!

In SEI, it's not just about learning how to use languages, libraries and frameworks - it's also about learning how to structure code and apply logic while implementing the features of a web app.

This guide provides you with:

- A process and data-centric approach that results in concise code, less bugs, and an app that is easier to add new features to.
- How to start a project, and
- How to organize/structure your code, in other words, how to "architect" your app.

## Client-Side MVC Architectural Approach

**Model-View-Controller (MVC)** is a popular software architectural pattern that is used to organize code in both client and server applications.

The following diagrams a typical client-side MVC architecture:

<img src="https://i.imgur.com/XagTF9B.jpg">

Let's briefly review the Model, View and Controller components...

### Model

The **Model** refers to the application's data that needs to be tracked/remembered - this data is often referred to as the application's **state**.

**Data** is the _single-source of truth_ of an application!
 
By following a "data-centric" approach, developers can more easily test the application's logic - in fact, we can test out much of the app in the console (assuming you keep your functions and state in global scope while developing the app)! For example, you can type something like `getWinner()` in the console to check what value is being returned from that function. 

An easy mistake new programmers make is using the **DOM** to hold state/information.  Instead, we need to use variables to hold **all** data that needs to be tracked during runtime, i.e., when a program is running.

By following this approach, a developer can re-use much of an application's code  if the application needs to be ported to other platforms such as mobile and desktop.

### View

The **View** is what the user sees and interacts with.

In a browser app, the View consists of the **DOM** elements created using HTML, CSS and JavaScript.

The View can be made to "listen" for user interaction such as a click by adding _event listeners_ to DOM elements. 

### Controller

The **Controller** is the bulk of your app's JavaScript, excluding the state variables (which represent the Model as described above).

The Controller provides the glue between the Model and View (notice how the Model and View don't "know" about each other).

In a browser app, it is the controller that adds event listeners to the View (DOM elements).

When an event occurs, e.g., the user clicks something, the Controller:

1. Updates the Model variables (state).
2. Updates the View (DOM), using the data contained in the Model variables (state).

### Summary

To summarize, the MVC architectural pattern organizes and structures code in a way that enables:

- Code to be more testable, reusable and extendable.
- Separation of the View (display) and business (application) logic. For example, you might decide to model a game of tic-tac-toe using the values of `1`, `-1` or `null` to represent whether a square holds Player X, Player O, or nobody, respectively.  However, when it comes time to render the app's state in the DOM, you can visualize the state anyway you want, for example, a value of `1` could be rendered as a certain image, etc.

## Overall Application Flow

Let's see how we might apply the MVC pattern when writing a browser app such as a game. 

The following diagrams how we could go about coding a browser-based game, or pretty much any browser-based app such as a calculator, a to do app, etc.:

<img src="https://i.imgur.com/jayaYY2.png">

## Key Points & Best Practices

### Have a Data-Centric Mindset

**Data (state) is the single source of truth of any application.**

When it comes to "making the app work", the DOM is secondary to data manipulation.

When coding the the event listener function(s), ask yourself,<br>
_**What state needs to be updated and how?**_<br>
instead of thinking about what to change in the DOM.

You'll get to think about the DOM when coding the `render()` function.

### Use Constants for Non-Changing Information

**Use constants** instead of literal values to improve code readability and maintenance.

For example, let's say you wanted to limit the number of guesses in a game to a certain number.<br>You could write code like this:

```js
let lose = numGuesses > 5;
```
However, code like the following would be easier to understand what the logic is and be more maintainable because you will probably need to use the maximum guesses value in more than one section of code:

```js
let lose = numGuesses > MAX_GUESSES;
```

### Use Objects to Hold Multiple Related Data

**Instead of using several separate variables to hold state**, consider using an object's properties to hold related-data.

For example, if you need to track info for two players, instead of using several variables like `player1name`, `player2name`, `player1score`, `player2score`, etc., use an object instead:

```js
const players = {
  '1': {
    name: '',
    score: 0
  },
  '-1': {
    name: '',
    score: 0
  }
};
```
	
Following this practice will result in **much more concise code** and make it easier to implement certain features such as persisting the state of a game.

### Don't Store State That Can be Computed

**Don't store state data that can be computed** as needed from other data. This avoids the risk of data becoming out of sync or inconsistent.

For example, in Tic-Tac-Toe it would not be necessary to track the number of moves to determine if there's a tie game because the variable used to track the state of the board can already provide this info:

```js
// Check for winner
let winner = checkBoardForWinner();
if (winner) return winner;
// There's no winner, so
// check for tie - board still contains null(s)
return board.includes(null) ? null : 'Tie';
```

### Cache DOM Elements

If the code needs to access a DOM element (or elements) more than once during runtime, select and **cache** it/them in a variable.

### Update the DOM Via `render()` Functions

**The `render()` function's responsibility is to visualize all state in the DOM**.

This includes the hiding/showing of parts of the UI based upon the application's state.  For example, when a hand is in play in a game of Blackjack, the `render()` function would show the hit/stand buttons and hide the betting-related buttons.

### Use Several `renderXXXX()` Functions 

The main `render()` function can grow quite large, so it's a best practice to use multiple render-related functions dedicated to a specific rendering task.

For example:
```js
function render() {
  renderBoard();
  renderScores();
  renderControls();
  renderMessages();
}
```

### Avoid Updating the DOM Outside of `render()`
Avoid updating the DOM outside of render-oriented functions.

However, "eye candy" animations, a ticking time display, etc. are exceptions to this rule.

### The Key Principle

The key principle to keep in mind is...

**In response to user interaction**:
1. **Update all state impacted by the interaction**, then
2. **Update the DOM by calling `render()`**.

So basically, the structure of any event listener function will look like this:

```js
function handleMove(evt) {
  // Check if we should exit the function
  // according to the current state
  // For example, ignore clicks if the
  // game has been won or is a tie:
  if (winner) return;
  // Logic/Code to update all impacted state
  ...
  // Visualize all state
  render();
}
```

## Steps to Getting Started on a Browser Game

The following approach has been proven to help students write complex front-end web apps, not just games...

If you're concerned that using the following approach will result in you and your fellow students having code that is structured similarly - don't be!  **What matters is what prospective employers think when they look at your projects's code structure in GitHub!**

1. **Analyze the app's functionality**

    The app's features, from the user's point of view, should be described using _User Stories_.
    
    User stories follow this template:<br>**As a [role], I want [feature] because [reason]**.<br>Example user story: _As a player, I want to see a list of high-scores so that I know what I have to score to make the list_.

2. **Think about the overall design (look & feel) of the app**
	
    Take the users (audience) of the app into consideration when determining the overall look and feel the app should have.
    
    Should the app have a clean/minimalist UI (current trend),  or should it be themed to match the app's purpose?

3. **Wireframe the UI**
 
    Wireframes provide a blueprint for the HTML & CSS.

    Wireframes also help reveal an application's state (data) and functionality.

4. **Pseudocode**

	  Pseudocode outlines the app's logic using plain language. It provides a road map to writing the code itself.
   
    For example, pseudocoding the logic for when a player makes a move, checking if the game has been won, etc., will prove to be helpful when writing the actual code.

5. **Identify the application's state (data)**
	
    What does the application need to "remember" throughout its execution?
    
    Use the wireframe and pseudocode to help identify what state needs to be tracked.

6. **Set up the project**

- Create a directory for the project in the `~/code` folder. 
	
- Create the starting folders/files within the project folder:

  - **index.html**
  - **css/main.css**
  - **js/main.js**
	
- Create the HTML boilerplate within **index.html** using `![tab]`.
	
- Link **main.css** in the `<head>`.

- Add a `<script>` tag to load the **main.js** in the `<head>`.

  Be sure to use the `defer` attribute to ensure that the DOM is ready before the script runs.
  
  Here you go:

    ```html
    <script defer src="js/main.js"></script>
    ```

7. **Create a local repo**

- Make your project a local repo with `git init`.

- Next, think about the name for your remote repo on GitHub - using a name that represents your choice of game, e.g., "blackjack", is better than something like "project-1".  It's also recommended that the name of the repo and the project directory match.

- Create your remote repo in your **PERSONAL** GitHub account - be sure **NOT** to check the "Initialize this repository with a README" checkbox (you'll want to `touch README.md` locally).
  
- Run the terminal command that the GitHub instructions provides to add the remote in your local repo.  It will look like this:
    ```
    git remote add origin <the URL to your repo>
    ```
  
- Make your first commit:  `git add -A`, then `git commit -m "Initial commit"`
  
- Push the commit to the repo for the **first time** using:<br>`git push -u origin main`.  

- Future pushes can now be made using just<br> `git push`.

8. **Organize the app's JS into sections**

	Copy/paste the following comment headings to help you organize your app's code:

  ```js
	/*----- constants -----*/


	/*----- state variables -----*/


	/*----- cached elements  -----*/


	/*----- event listeners -----*/


	/*----- functions -----*/

  ```

9. **Code away!**
	
  - Start with some HTML in index.html for the basic layout of the UI. If an element's content is going to come from the `render` function, you may want to temporarily include mocked content in the HTML to help with layout and styling. However, once the content is being provided by the `render()` function, you should remove the mocked content from index.html.
	
  - Declare, but don't initialize, the application-wide state variables. The initialization of the variables to their "initial" state should be done within an `initialize`, or similarly named function, e.g., `init`.
	
  - Write that `initialize` function.
	
  - Invoke `initialize()` to "kick off" the app.

  - Now that the `initialize` function has initialized the state variables, the last line in `initialize` should be `render();` to render that state to the DOM for the first time.
	
  - Stub up that `render()` function.
  
  - As a reminder, after state has been updated in an event listener, the last line of code in the event listener function should be a call to `render();` again, to render the state to the DOM.
	
  - Register event listeners - be sure to use event delegation!
	
  - Code the event listener(s). This is where most of the app's logic will exist.

11. **Make frequent git commits**

    At a minimum, commit after each "milestone" or feature implementation.

12. **Have fun!**