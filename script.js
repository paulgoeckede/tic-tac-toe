//player object factory function
const player = (input) => {
  const playerInput = input;

  //calls the function to change the array accordingly
  const makeMove = (field) => {
    return gameBoard.changeArray(playerInput, field);
  };
  return { playerInput, makeMove };
};

//Gameboard module - keeps track of players move and the game.
const gameBoard = (() => {
  const _game = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //stores the current state of the game being played
  let _turns = 0; //keeps track of the number of turns (used to check for draw)

  //checks whether the field selected by each player is empty or not
  const isFieldEmpty = (field) => {
    if (!isNaN(_game[field])) {
      return true;
    }
    return false;
  };

  //changes the array that keeps track of the playing fields accordingly if the player selection is not an occupied field
  const changeArray = (input, field) => {
    if (isFieldEmpty(field)) {
      _game[field] = input;
      _turns++;
      return true; //this true or false return is used to later check if the field selected by each player is empty or not, the code to change selected fields will only be run if this returns true
    }
    return false;
  };

  //checks if a player has won
  const checkWinCondition = (input, state) => {
    if (
      //Checks all possible win configurations
      (state[0] === input && state[1] === input && state[2] === input) ||
      (state[3] === input && state[4] === input && state[5] === input) ||
      (state[6] === input && state[7] === input && state[8] === input) ||
      (state[0] === input && state[3] === input && state[6] === input) ||
      (state[1] === input && state[4] === input && state[7] === input) ||
      (state[2] === input && state[5] === input && state[8] === input) ||
      (state[0] === input && state[4] === input && state[8] === input) ||
      (state[2] === input && state[4] === input && state[6] === input)
    ) {
      return true;
    }
    return false;
  };

  //checks if the game has drawn
  const checkDraw = () => {
    if (_turns === 9) {
      //if 9 turns have been made and neither player has won, this means that it is a draw
      return true;
    }
    return false;
  };

  //clears the gamestate-Array
  const clearArray = () => {
    for (let i = 0; i < _game.length; i++) {
      _game[i] = i;
    }
    _turns = 0;
  };

  const getGame = () => {
    //returns the gamestate-Array (needed for computer AI)
    return _game;
  };

  return { changeArray, checkWinCondition, checkDraw, clearArray, getGame };
})();

//functionality for displaying the current game on the screen
const displayController = (() => {
  let _turn = 0; //this keeps track whether player 1 or 2 is currently playing
  const playerOneDiv = document.querySelector("#playerOneDiv"); //player info field on the left side of the board
  const playerTwoDiv = document.querySelector("#playerTwoDiv"); //player info field on the right side of the board
  const _fields = document.querySelectorAll(".field"); //grabs all 9 fields
  const _fieldsArray = Array.from(_fields); //create an array from all 9 fields
  const _playButton = document.querySelector("#playButton"); //playButton
  let _gameRunning = false; //checks whether the game is already running or not, this is important for the play/restart button
  let _playerOneName = null; //keeps track of the player one name
  let _playerTwoName = null; //keeps track of the player two name
  let _currentModeComputer = false; //keeps track whether or not user is in two player mode or computer mode
  let _gameOver = false; //keeps track whether the game is over, important to stop the computer selection code from being executed after players selection

  //adds event listeners/functionality to all 9 fields
  const _playGame = () => {
    _fieldsArray.forEach(function (field) {
      field.addEventListener("click", (e) => {
        if (_turn % 2 === 0) {
          //if this is true, that means its player 1s turn
          if (playerOne.makeMove(e.target.dataset.field)) {
            //condition to check if selected field is empty or not
            _turn++;
            if (
              gameBoard.checkWinCondition(
                playerOne.playerInput,
                gameBoard.getGame()
              ) //always checks if the player has just won the game with the last selected field
            ) {
              field.innerHTML = "";
              _endGame();
              _displayWinMsg(`${_playerOneName} won!`);
              _gameOver = true;
              //checks if the game has been drawn with the players last selection
            } else if (gameBoard.checkDraw()) {
              field.innerHTML = "";
              _endGame();
              _displayWinMsg("It's a draw!");
              _gameOver = true;
              //if both options above are not true that means game is still in progress after player selection and the input is added to the display
            } else {
              field.innerHTML = playerOne.playerInput;
              field.classList.add("inputAnimation");
            }
            playerOneDiv.classList.toggle("turn"); //visual effect for keeping track on whose turn it is when in two player mode (also gets executed in computer mode but does not change anything)
            playerTwoDiv.classList.toggle("turn");
            if (
              _currentModeComputer && //if player has chosen to play against the computer
              !_gameOver && //and the game is not over (stops code from executing if the player has just won with his last selection)
              document.querySelector("select").value === "easy" //and the player has chosen the easy difficulty
            ) {
              changeField(
                _fieldsArray[computerAI.makeRandomMove()], //computer makes a random move
                playerTwo.playerInput
              );
              _turn = 0; //resets turn so on the next click its player 1s turn again
              if (
                //checks if computer has won with his last selection
                gameBoard.checkWinCondition(
                  playerTwo.playerInput,
                  gameBoard.getGame()
                )
              ) {
                _endGame();
                _displayWinMsg(`Computer won!`);
                //checks if game has drawn with computers last selection
              } else if (gameBoard.checkDraw()) {
                _endGame();
                _displayWinMsg("It's a draw!");
              }
            } else if (
              //functionality for hard mode, some logic as above
              _currentModeComputer &&
              !_gameOver &&
              document.querySelector("select").value === "hard"
            ) {
              // calls the minMax function which returns the best possible option for the computer to play
              const _minMaxField = computerAI.minMax(
                true,
                gameBoard.getGame()
              ).index;
              changeField(_fieldsArray[_minMaxField], playerTwo.playerInput); //change board with computers selection/make the move
              _turn = 0;
              //checks win and draw conditions
              if (
                gameBoard.checkWinCondition(
                  playerTwo.playerInput,
                  gameBoard.getGame()
                )
              ) {
                _endGame();
                _displayWinMsg("Computer won!");
              } else if (gameBoard.checkDraw()) {
                _endGame();
                _displayWinMsg("It's a draw!");
              }
            }
          }
        } else {
          //if the player has two player mode enabled, this else loop is called
          if (!_currentModeComputer) {
            if (playerTwo.makeMove(e.target.dataset.field)) {
              //condition to check if selected field is empty or not
              _turn = 0;
              if (
                gameBoard.checkWinCondition(
                  playerTwo.playerInput,
                  gameBoard.getGame()
                )
              ) {
                _endGame();
                _displayWinMsg(`${_playerTwoName} won!`);
              } else if (gameBoard.checkDraw()) {
                _endGame();
                _displayWinMsg("It's a draw!");
              } else {
                field.innerHTML = playerTwo.playerInput;
              }
              playerOneDiv.classList.toggle("turn");
              playerTwoDiv.classList.toggle("turn");
            }
          }
        }
      });
    });
  };

  const changeField = (field, input) => {
    //honestly this function is probably not necessary but is used for the computerAIs selection code above and just made it more readble for me, does basically the same as if you would just call the changeArray function of gameBoard directly
    field.innerHTML = input;
    gameBoard.changeArray(input, field.dataset.field);
  };

  //Logic for when the playButton is clicked on the page
  const _playButtonFunc = () => {
    _playButton.addEventListener("click", () => {
      //checks the current mode
      if (!_currentModeComputer) {
        //if players names have been entered, grabs and stores them and updates the display accordingly
        if (
          document.getElementById("playerOne").value.length !== 0 &&
          document.getElementById("playerTwo").value.length !== 0
        ) {
          _playerOneName = document.getElementById("playerOne").value;
          _playerTwoName = document.getElementById("playerTwo").value;
          playerOneDiv.innerHTML = `<h3>${_playerOneName}:</h3><p>X</p>`;
          playerTwoDiv.innerHTML = `<h3>${_playerTwoName}:</h3><p>O</p>`;
          playerOneDiv.classList.add("turn");
          playerTwoDiv.classList.remove("turn");
          document.getElementById("playerOne").value = "";
          document.getElementById("playerTwo").value = "";
          _endGame(); //ends Game when restart/play button is clicked just to be safe
          document.getElementById("overlay").style.display = "none"; //removes the winMsg overlay that is displayed when a game ends
          //if the game is not already running, starts the game - this is important because otherwise you could double event listeners
          if (!_gameRunning) {
            _playGame();
            _gameRunning = true;
          }
          //checks if there are already player names stored so it keeps working with those instead of grabbing the empty input fields
        } else if (_playerOneName !== null && _playerTwoName !== null) {
          playerOneDiv.classList.add("turn");
          playerTwoDiv.classList.remove("turn");
          _endGame();
          document.getElementById("overlay").style.display = "none";
        } else {
          alert("Please enter both players names!");
        }
      } else {
        //below is basically the same logic as above just with one name if the player is playing against the computer
        if (document.getElementById("playerOne").value.length !== 0) {
          _playerOneName = document.getElementById("playerOne").value;
          _endGame();
          if (!_gameRunning) {
            _playGame();
            _gameRunning = true;
          }
          document.getElementById("overlay").style.display = "none";
        } else if (_playerOneName !== null) {
          _endGame();
          document.getElementById("overlay").style.display = "none";
        } else {
          alert("Please enter your name!");
        }
      }
      _gameOver = false; //resets this so when player hits restart the computer code above executes again
    });
  };

  //clears all important data when a game has ended
  const _endGame = () => {
    _fieldsArray.forEach(function (field) {
      field.innerHTML = "";
    });
    _playButton.innerHTML = "Restart";
    _turn = 0;
    gameBoard.clearArray();
  };

  //adds winMsg overlay upon the game ending
  const _displayWinMsg = (winMsg) => {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("overlay-text").innerHTML = `${winMsg}`;
  };

  //toggles display between two player mode and computer mode
  const _toggleComputerMode = () => {
    const _inputForm = document.querySelector(".inputForm");
    const _playerTwoInput = document.querySelector("#playerTwo");
    const orSpan = document.querySelector("#orSpan");
    const modeSwitchBtn = document.querySelector("#modeSwitch");

    //upon toggling it clears all stored data on the players names and deletes the display left and right of the board if user was in two player mode
    _playerOneName = null;
    _playerTwoName = null;
    playerOneDiv.innerHTML = "";
    playerTwoDiv.innerHTML = "";

    //this changes the display accordingly depending on whether youre switching into 2 player mode or computer mode
    if (_currentModeComputer) {
      const dropdown = document.querySelector("select");
      _inputForm.removeChild(dropdown);
      const newInput = document.createElement("input");
      newInput.setAttribute("placeholder", "Player Two");
      newInput.setAttribute("id", "playerTwo");
      _inputForm.insertBefore(newInput, orSpan);
      modeSwitchBtn.innerHTML = "Play against Computer";
      _currentModeComputer = false;
    } else {
      _inputForm.removeChild(_playerTwoInput); //removes the input Player Two name field
      const dropdown = document.createElement("select");
      dropdown.setAttribute("name", "Difficulty");
      const easyOption = document.createElement("option");
      const hardOption = document.createElement("option");
      easyOption.setAttribute("value", "easy");
      hardOption.setAttribute("value", "hard");
      easyOption.innerHTML = "Easy";
      hardOption.innerHTML = "Hard";
      dropdown.appendChild(easyOption);
      dropdown.appendChild(hardOption);
      _inputForm.insertBefore(dropdown, orSpan);
      modeSwitchBtn.innerHTML = "Two Player Mode";
      _currentModeComputer = true;
    }
  };

  //adds event listener to the toggle mode button and calls the toggleComputerMode function to change the display accordingly
  const _computerButton = () => {
    const _modeSwitchBtn = document.querySelector("#modeSwitch");
    _modeSwitchBtn.addEventListener("click", () => {
      _toggleComputerMode();
    });
  };

  _playButtonFunc();
  _computerButton();
})();

const computerAI = (() => {
  //returns a random move picked out of the remaining open fields on the board
  const makeRandomMove = () => {
    const _currentGame = gameBoard.getGame();
    const _freeArray = [];

    for (let i = 0; i < _currentGame.length; i++) {
      if (!isNaN(_currentGame[i])) {
        _freeArray.push(_currentGame[i]);
      }
    }
    const _randomField = Math.floor(Math.random() * _freeArray.length);
    return _freeArray[_randomField];
  };

  const minMax = (isMaxPlayer, state) => {
    const _freeArray = [];
    //tracks all free/available spaces on the board onto _freeArray
    for (let i = 0; i < state.length; i++) {
      if (!isNaN(state[i])) {
        _freeArray.push(state[i]);
      }
    }

    //returns appropriate score depending on whether either player has won or the game has drawn
    if (gameBoard.checkWinCondition(playerTwo.playerInput, state)) {
      return { score: 10 };
    } else if (gameBoard.checkWinCondition(playerOne.playerInput, state)) {
      return { score: -10 };
    } else if (_freeArray.length === 0) {
      return { score: 0 };
    }

    const _moveArray = []; //stores all available moves on the current recursion level

    for (let i = 0; i < _freeArray.length; i++) {
      let move = {};
      move.index = state[_freeArray[i]]; //keeps track of the current field the function is analyzing

      //isMaxPlayer is the AI, this recursively calls the minmax function again and evaluates how good each possible move is. higher score equals better move for AI
      if (isMaxPlayer) {
        state[_freeArray[i]] = playerTwo.playerInput; //circles through each possible move and adds it to the current state, calls the function again with new state
        let result = minMax(false, state);
        move.score = result.score; //this will eventually return one value, which is added to the current moves object
        //same logic as above but with the players POV who tries to minimize the score
      } else {
        state[_freeArray[i]] = playerOne.playerInput;
        let result = minMax(true, state);
        move.score = result.score;
      }

      state[_freeArray[i]] = move.index; //removes the last checked move from the current state again to circle back
      _moveArray.push(move); //adds the resulting calculated best move to the move array keeping track of all available moves and their respective scores
    }

    let _bestMove; //this will store the best possible move out of the given array of possible moves with their respective scores

    //this needs to check whether the current level is the users or AIs turn, because the scores will be evaluated differently
    if (isMaxPlayer) {
      let _bestMaxScore = -1000;
      for (let i = 0; i < _moveArray.length; i++) {
        //the higher the score the better the move for the AI, so returns the move with the best score
        if (_moveArray[i].score > _bestMaxScore) {
          _bestMaxScore = _moveArray[i].score;
          _bestMove = i;
        }
      }
    } else {
      let _bestMinScore = 1000;
      for (let i = 0; i < _moveArray.length; i++) {
        //the lower the score the better the move for the user, so returns the move with the best score
        if (_moveArray[i].score < _bestMinScore) {
          _bestMinScore = _moveArray[i].score;
          _bestMove = i;
        }
      }
    }
    return _moveArray[_bestMove]; //finally returns the best move for the current state
  };

  return { makeRandomMove, minMax };
})();

const playerOne = player("x");
const playerTwo = player("o");
