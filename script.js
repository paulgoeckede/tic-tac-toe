/* Your main goal here is to have as little global code as possible. Try tucking everything away inside of a module or factory. Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories. */

//player object factory function
const player = (input) => {
    const _playerInput = input;

    const makeMove = (field) => {
        gameBoard.changeArray(_playerInput, field);
    }

    return {_playerInput};
}
//Gameboard module - keeps track of players move and the game.
const gameBoard = (() => {
    const _game = ["","","","","","","","","",""];
    const _playerOne = player("x");
    const _playerTwo = player("o");
    
    const changeArray = (field) => {
        // game[input] = field;
        console.log(field);
    };
    return {changeArray};
})();

//functionality for displaying the current game on the screen
const displayController = (() => {
    const _fields = document.querySelectorAll(".field");
    const _fieldsArray = Array.from(_fields);
    _fieldsArray.forEach(function(field){
        field.addEventListener("click", (e) => {
            gameBoard.makeMove(e.target.dataset.field);
        });
    });
})();


/* 
PSEUDO CODE:
Gameboard: Gameboard should basically keep track of the game. It is not supposed to display the game in any way but keep track of it by utilising an array. It should also have the functionality to make moves for either player and manipulate the array correctly. 
*/