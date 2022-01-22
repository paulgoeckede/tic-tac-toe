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
    const _game = ["","","","","","","","","",""];
    let _turns = 0;
    
    //checks whether the field selected by each player is empty or not
    const isFieldEmpty = (field) => {
        if(_game[field]===""){
            return true;
        }
        return false;
    }

    //changes the array that keeps track of the playing fields accordingly if the player selection is not an occupied field
    const changeArray = (input, field) => {
        if(isFieldEmpty(field)){
            _game[field] = input;
            return true;
        }
        return false;
    };

    //logs the playing field for testing purposes
    const logArray = () => {
        console.log(_game);
    }

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
               _turns++;
               return true;
           }
        _turns++;
        return false;
    }

    //checks if the game has drawn
    const checkDraw = () => {
        if(_turns===9){
            return true;
        }
        return false;
    }

    return {changeArray, logArray, checkWinCondition, checkDraw};
})();

//functionality for displaying the current game on the screen
const displayController = (() => {
    let _turn = 0; //this keeps track whether player 1 or 2 is currently playing

    const _fields = document.querySelectorAll(".field"); //grabs all 9 fields
    const _fieldsArray = Array.from(_fields);
    _fieldsArray.forEach(function(field){
        field.addEventListener("click", (e) => {
            if(_turn%2===0){ //if this is true, then its player 1s turn
                if(playerOne.makeMove(e.target.dataset.field)){ //condition to check if selected field is empty or not
                    gameBoard.logArray();
                    _turn++;
                    field.innerHTML = playerOne.playerInput;
                    if(gameBoard.checkWinCondition(playerOne.playerInput)){
                        console.log("Player One Wins!");
                    } else if(gameBoard.checkDraw()){
                        console.log("It's a draw!");
                    }
                }
            }else{ //player 2s turn
                if(playerTwo.makeMove(e.target.dataset.field)){ //condition to check if selected field is empty or not
                    gameBoard.logArray();
                    _turn=0;
                    field.innerHTML = playerTwo.playerInput;
                    if(gameBoard.checkWinCondition(playerTwo.playerInput)){
                        console.log("Player Two Wins!");
                    } else if(gameBoard.checkDraw()){
                        console.log("It's a draw!");
                    }
                }
            }
        });
    });
})();

const playerOne = player("x");
const playerTwo = player("o");


/* 
PSEUDO CODE:
Gameboard: Gameboard should basically keep track of the game. It is not supposed to display the game in any way but keep track of it by utilising an array. It should also have the functionality to make moves for either player and manipulate the array correctly. 
*/