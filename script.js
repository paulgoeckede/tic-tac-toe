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
    const checkWinCondition = (input) => {
        if((_game[0] === input && _game[1] === input && _game[2] === input) ||
           (_game[3] === input && _game[4] === input && _game[5] === input) ||
           (_game[6] === input && _game[7] === input && _game[8] === input) ||
           (_game[0] === input && _game[3] === input && _game[6] === input) ||
           (_game[1] === input && _game[4] === input && _game[7] === input) ||
           (_game[2] === input && _game[5] === input && _game[8] === input) ||
           (_game[0] === input && _game[4] === input && _game[8] === input) ||
           (_game[2] === input && _game[4] === input && _game[6] === input) ){
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

    return {changeArray, checkWinCondition, checkDraw, clearArray};
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

    const _playGame = () => {
        _fieldsArray.forEach(function(field){
            field.addEventListener("click", (e) => {
                if(_turn%2===0){ //if this is true, then its player 1s turn
                    if(playerOne.makeMove(e.target.dataset.field)){ //condition to check if selected field is empty or not
                        _turn++;
                        if(gameBoard.checkWinCondition(playerOne.playerInput)){
                            field.innerHTML = "";
                            _endGame();
                            _displayWinMsg(`${_playerOneName} won!`);
                        } else if(gameBoard.checkDraw()){
                            field.innerHTML = "";
                            _endGame();
                            _displayWinMsg("It's a draw!");
                        } else{
                            field.innerHTML = playerOne.playerInput;
                        }
                        playerOneDiv.classList.toggle("turn");
                        playerTwoDiv.classList.toggle("turn");
                    }
                }else{ //player 2s turn
                    if(playerTwo.makeMove(e.target.dataset.field)){ //condition to check if selected field is empty or not
                        _turn=0;
                        if(gameBoard.checkWinCondition(playerTwo.playerInput)){
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
            });
        });
    };

    const _playButtonFunc = () => {
        _playButton.addEventListener("click", () => {
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

    _playButtonFunc();
})();

const playerOne = player("x");
const playerTwo = player("o");

/* 
PSEUDO CODE:
Gameboard: Gameboard should basically keep track of the game. It is not supposed to display the game in any way but keep track of it by utilising an array. It should also have the functionality to make moves for either player and manipulate the array correctly. 
*/