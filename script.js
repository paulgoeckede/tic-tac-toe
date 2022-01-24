/* Your main goal here is to have as little global code as possible. Try tucking everything away inside of a module or factory. Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories. */

//player object factory function
const player = (input) => {
    const playerInput = input;

    //calls the function to change the array accordingly
    const makeMove = (field) => {
        return gameBoard.changeArray(playerInput, field);
    }
    return {playerInput, makeMove};
}

//Gameboard module - keeps track of players move and the game.
const gameBoard = (() => {
    const _game = [0,1,2,3,4,5,6,7,8];
    let _turns = 0;
    
    //checks whether the field selected by each player is empty or not
    const isFieldEmpty = (field) => {
        if(!isNaN(_game[field])){
            return true;
        }
        return false;
    }

    //changes the array that keeps track of the playing fields accordingly if the player selection is not an occupied field
    const changeArray = (input, field) => {
        if(isFieldEmpty(field)){
            _game[field] = input;
            _turns++;
            return true;
        }
        return false;
    };

    //checks if a player has won
    const checkWinCondition = (input, state) => {
        if((state[0] === input && state[1] === input && state[2] === input) ||
           (state[3] === input && state[4] === input && state[5] === input) ||
           (state[6] === input && state[7] === input && state[8] === input) ||
           (state[0] === input && state[3] === input && state[6] === input) ||
           (state[1] === input && state[4] === input && state[7] === input) ||
           (state[2] === input && state[5] === input && state[8] === input) ||
           (state[0] === input && state[4] === input && state[8] === input) ||
           (state[2] === input && state[4] === input && state[6] === input) ){
               return true;
           }
        return false;
    };

    //checks if the game has drawn
    const checkDraw = () => {
        if(_turns===9){
            return true;
        }
        return false;
    };

    //clears the Array
    const clearArray = () => {
        for(let i = 0; i<_game.length; i++){
            _game[i] = i;
        }
        _turns = 0;
    };

    const getGame = () => {
        return _game;
    };

    return {changeArray, checkWinCondition, checkDraw, clearArray, getGame};
})();

//functionality for displaying the current game on the screen
const displayController = (() => {

    let _turn = 0; //this keeps track whether player 1 or 2 is currently playing
    const playerOneDiv = document.querySelector("#playerOneDiv");
    const playerTwoDiv = document.querySelector("#playerTwoDiv");
    const _fields = document.querySelectorAll(".field"); //grabs all 9 fields
    const _fieldsArray = Array.from(_fields);
    const _playButton = document.querySelector("#playButton");
    let _gameRunning = false;
    let _playerOneName = null;
    let _playerTwoName = null;
    let _currentModeComputer = false;
    let _gameOver = false;

    //adds event listeners/functionality to all 9 fields
    const _playGame = () => {
        _fieldsArray.forEach(function(field){
            field.addEventListener("click", (e) => {
                if(_turn%2===0){ //if this is true, then its player 1s turn
                    if(playerOne.makeMove(e.target.dataset.field)){ //condition to check if selected field is empty or not
                        _turn++;
                        if(gameBoard.checkWinCondition(playerOne.playerInput, gameBoard.getGame())){
                            field.innerHTML = "";
                            _endGame();
                            _displayWinMsg(`${_playerOneName} won!`);
                            _gameOver = true;
                        } else if(gameBoard.checkDraw()){
                            field.innerHTML = "";
                            _endGame();
                            _displayWinMsg("It's a draw!");
                            _gameOver = true;
                        } else{
                            field.innerHTML = playerOne.playerInput;
                        }
                        playerOneDiv.classList.toggle("turn");
                        playerTwoDiv.classList.toggle("turn");
                        if(_currentModeComputer && !_gameOver && document.querySelector("select").value === "easy"){
                            changeField(_fieldsArray[computerAI.makeRandomMove()], playerTwo.playerInput);
                            _turn = 0;
                            if(gameBoard.checkWinCondition(playerTwo.playerInput, gameBoard.getGame())){
                                _endGame();
                                _displayWinMsg(`Computer won!`);
                            } else if(gameBoard.checkDraw()){
                                _endGame();
                                _displayWinMsg("It's a draw!");
                            }
                        } else if (_currentModeComputer && !_gameOver && document.querySelector("select").value === "hard"){
                            const _minMaxField = computerAI.minMax(true, gameBoard.getGame()).index;
                            changeField(_fieldsArray[_minMaxField], playerTwo.playerInput);
                            _turn = 0;
                            if(gameBoard.checkWinCondition(playerTwo.playerInput, gameBoard.getGame())){
                                _endGame();
                                _displayWinMsg("Computer won!");
                            }else if(gameBoard.checkDraw()){
                                _endGame();
                                _displayWinMsg("It's a draw!");
                            }
                        }
                    }
                }else{ //player 2s turn
                    if(!_currentModeComputer){
                        if(playerTwo.makeMove(e.target.dataset.field)){ //condition to check if selected field is empty or not
                            _turn=0;
                            if(gameBoard.checkWinCondition(playerTwo.playerInput, gameBoard.getGame())){
                                _endGame();
                                _displayWinMsg(`${_playerTwoName} won!`);
                            } else if(gameBoard.checkDraw()){
                                _endGame();
                                _displayWinMsg("It's a draw!");
                            } else{
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
        field.innerHTML = input;
        gameBoard.changeArray(input, field.dataset.field);
    }

    const _playButtonFunc = () => {
        _playButton.addEventListener("click", () => {
            if(!_currentModeComputer){
                if(document.getElementById("playerOne").value.length !== 0 && document.getElementById("playerTwo").value.length!==0){
                    _playerOneName = document.getElementById("playerOne").value;
                    _playerTwoName = document.getElementById("playerTwo").value;
                    playerOneDiv.innerHTML = `<h3>${_playerOneName}:</h3><p>X</p>`;
                    playerTwoDiv.innerHTML = `<h3>${_playerTwoName}:</h3><p>O</p>`;
                    playerOneDiv.classList.add("turn");
                    playerTwoDiv.classList.remove("turn");
                    document.getElementById("playerOne").value = "";
                    document.getElementById("playerTwo").value = "";
                    _endGame();
                    document.getElementById("overlay").style.display = "none";
                    if(!_gameRunning){
                        _playGame();
                        _gameRunning = true;
                    }
                } else if(_playerOneName !== null && _playerTwoName !== null){
                    playerOneDiv.classList.add("turn");
                    playerTwoDiv.classList.remove("turn");
                    _endGame();
                    document.getElementById("overlay").style.display = "none";
                } else {
                    alert("Please enter both players names!");
                }
            } else{
                if(document.getElementById("playerOne").value.length !== 0){
                    _playerOneName = document.getElementById("playerOne").value;
                    _endGame();
                    if(!_gameRunning){
                        _playGame();
                        _gameRunning = true;
                    }
                    document.getElementById("overlay").style.display = "none";
                }  else if(_playerOneName !== null){
                    _endGame();
                    document.getElementById("overlay").style.display = "none";
                } else{
                    alert("Please enter your name!");
                }
            }
            _gameOver = false;
        });
    };

    const _endGame = () => {
        _fieldsArray.forEach(function(field){
            field.innerHTML = "";
        });
        _playButton.innerHTML = "Restart";
        _turn=0;
        gameBoard.clearArray();
    };

    const _displayWinMsg = (winMsg) => {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlay-text").innerHTML = `${winMsg}`;
    };

    const _toggleComputerMode = () => {
        const _inputForm = document.querySelector(".inputForm");
        const _playerTwoInput = document.querySelector("#playerTwo");
        const orSpan = document.querySelector("#orSpan");
        const modeSwitchBtn = document.querySelector("#modeSwitch");

        _playerOneName = null;
        _playerTwoName = null;
        playerOneDiv.innerHTML = "";
        playerTwoDiv.innerHTML = "";

        if(_currentModeComputer){
            const dropdown = document.querySelector("select");
            _inputForm.removeChild(dropdown);
            const newInput = document.createElement("input");
            newInput.setAttribute("placeholder", "Player Two");
            newInput.setAttribute("id", "playerTwo");
            _inputForm.insertBefore(newInput, orSpan);
            modeSwitchBtn.innerHTML = "Play against Computer";
            _currentModeComputer = false;
        }else{
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
    }

    const _computerButton = () => {
        const _modeSwitchBtn = document.querySelector("#modeSwitch");
        _modeSwitchBtn.addEventListener("click", () => {
            _toggleComputerMode();
        });
    }

    _playButtonFunc();
    _computerButton();
})();

const computerAI = (() => {
    let _lastChanged; //for the minmax function

    const makeRandomMove = () => {
        const _currentGame = gameBoard.getGame();
        const _freeArray = [];

        for(let i = 0; i<_currentGame.length; i++){
            if(!isNaN(_currentGame[i])){
                _freeArray.push(_currentGame[i]);
            }
        }
        const _randomField = Math.floor(Math.random() * _freeArray.length);
        return _freeArray[_randomField];
    };

    const minMax = (isMaxPlayer, state) => {
        const _freeArray = [];
        //tracks all free/available spaces on the board onto _freeArray
        for(let i = 0; i<state.length; i++){
            if(!isNaN(state[i])){
                _freeArray.push(state[i]);
            }
        }

        if(gameBoard.checkWinCondition(playerTwo.playerInput, state)){
            return {score: 10};
        } else if (gameBoard.checkWinCondition(playerOne.playerInput, state)){
            return {score: -10};
        } else if (_freeArray.length === 0){
            return {score: 0};
        }

        // let _minMaxValue; //declare variable that keeps track of the minmax score/value
        const _moveArray = [];

        for (let i = 0; i<_freeArray.length; i++){
            let move = {};
            move.index = state[_freeArray[i]];
            
            if (isMaxPlayer) {
                state[_freeArray[i]] = playerTwo.playerInput;
                let result = minMax(false, state);
                move.score = result.score;
            } else {
                state[_freeArray[i]] = playerOne.playerInput;
                let result = minMax(true, state);
                move.score = result.score;
            }

            state[_freeArray[i]] = move.index;
            _moveArray.push(move);
        }

        let _bestMove;


        if(isMaxPlayer){
            let _bestMaxScore = -1000;
            for (let i = 0; i<_moveArray.length; i++){
                if(_moveArray[i].score > _bestMaxScore){
                    _bestMaxScore = _moveArray[i].score;
                    _bestMove = i;
                }
            }
        } else {
            let _bestMinScore = 1000;
            for (let i = 0; i<_moveArray.length; i++){
                if(_moveArray[i].score < _bestMinScore){
                    _bestMinScore = _moveArray[i].score;
                    _bestMove = i;
                }
            }
        }
        return _moveArray[_bestMove];
        /* 
        - parameters: depth, min or max Player, current state
        - check if it is the maximizing player (AI) or the minimizing player (user)
        - loop through all possible move variations
        - for each game variation
            - check if necessary depth is reached
                - if yes, return object with field and value 0
                - if no, continue
            - check if the game has finished
                - if yes, update the minmax variable accordingly
                - return minmax variable minus/plus depth depending on the player and field as object
                - if no continue
            - call minmax function again (recursion) with the other player and depth -1
        - loop through array of objects (should be all possible next moves) and pick the one with the best score -> if current player max (AI), pick the one with the highest score, if current player min (user) pick the one with the lowest score
        - return object with field and score.
        */
    };

    return {makeRandomMove, minMax};

})();

const playerOne = player("x");
const playerTwo = player("o");

/* 
PSEUDO CODE:
Gameboard: Gameboard should basically keep track of the game. It is not supposed to display the game in any way but keep track of it by utilising an array. It should also have the functionality to make moves for either player and manipulate the array correctly. 
*/