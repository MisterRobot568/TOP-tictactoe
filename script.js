// 1) create a gameboard function with a gameboard array to store the game. 
// since we'll only need one instance of a gameboard object, wrap the factory in 
// an IIFE (this creates a module)

const gameboard = (function () {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    const add_piece = (x, y, player) => board[x][y] = player;
    const reset_board = () => board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    return { add_piece, board, reset_board }
})();

// 2) create the player object as a factory. This will keep track of each player
// and their symbol (x or o), and name

function createPlayer(name, symbol) {
    let playerName = name;
    let playerSymbol = symbol;

    // const getName = () => playerName;
    // const getSymbol = () => playerSymbol;
    const setName = (newName) => playerName = newName

    return { playerName, playerSymbol, setName };
}


//##################################################################
const displayLogic = (function () {
    // document.querySelector('.game-container').addEventListener('click', handleSpaceClick)
    let clickedSpace;
    // Write a function that will render the contents of the gameboard array to the webpage
    function renderBoard() {
        for (let row = 0; row < gameboard.board.length; row++) {
            for (let col = 0; col < gameboard.board[row].length; col++) {
                if (gameboard.board[row][col] != '') {
                    // Write the piece to the board
                    const space_index = `${row}${col}`;
                    const board_space = document.querySelector(`[data-index="${space_index}"]`);
                    board_space.textContent = gameboard.board[row][col];

                }
            }
        }
    }
    document.querySelector('.game-container').addEventListener('click', handleSpaceClick);

    //write the function that will allow players to add marks to a specific spot on the
    // board by interacting with the appropriate DOM Elements
    function handleSpaceClick(playerSymbol, turnTracker) {
        const currentPlayerSymbol = turnTracker % 2 === 0 ? 'X' : 'O';
        if (playerSymbol === currentPlayerSymbol) {
            clickedSpace = playerSymbol.target
        }
        // const clickedSpace = playerSymbol.target;

        if (clickedSpace && clickedSpace.classList && clickedSpace.classList.contains("square") && clickedSpace.textContent === '') {
            const index = clickedSpace.dataset.index;
            const [row, col] = index.split('');
            // assuming 'X' and 'O' are player symbols, change accordingly
            const currentPlayerSymbol = turnTracker % 2 === 0 ? 'X' : 'O';

            //update the game board and render the changes
            gameboard.add_piece(Number(row), Number(col), currentPlayerSymbol);
            renderBoard();
        }
    }



    return { renderBoard, handleSpaceClick }
})();
//#################################################################
// 3) object to control the flow of the game, we only need one 
// instance of this so maybe in a module/ IIFE?
const gameController = (function () {
    let game_over = false;
    let turn_tracker = 0;
    // const playerOne = createPlayer('p1', 'X');
    // const playerTwo = createPlayer('p2', 'O');

    // this function checks the board to see if every space has been taken
    // (after we have checked to see if there is a winner). If every space has been
    // used and there is still not winner, return true
    function tieChecker() {
        for (let row = 0; row < gameboard.board.length; row++) {
            for (let col = 0; col < gameboard.board[row].length; col++) {
                if (gameboard.board[row][col] === '') {
                    return false
                }
            }
        }
        return true;
    }

    // winChecker returns two parameters. The first output is true if there is a winning
    // pattern on the board and false if not. The second output is the symbol of the winner.

    function winChecker() {
        let win = false
        let winner = null;

        if ( //check for winner who ALSO touches the center piece
            ((gameboard.board[1][0] == gameboard.board[1][1] && gameboard.board[1][1] == gameboard.board[1][2] && (gameboard.board[1][2] == 'X' || gameboard.board[1][2] == 'O'))) ||
            ((gameboard.board[0][1] == gameboard.board[1][1] && gameboard.board[1][1] == gameboard.board[2][1] && (gameboard.board[2][1] == 'X' || gameboard.board[2][1] == 'O'))) ||
            ((gameboard.board[0][0] == gameboard.board[1][1] && gameboard.board[1][1] == gameboard.board[2][2] && (gameboard.board[2][2] == 'X' || gameboard.board[2][2] == 'O'))) ||
            ((gameboard.board[0][2] == gameboard.board[1][1] && gameboard.board[1][1] == gameboard.board[2][0] && (gameboard.board[2][0] == 'X' || gameboard.board[2][0] == 'O')))
        ) {
            win = true;
            winner = gameboard.board[1][1];

        } else if ( // check for winner who ALSO touches the top left piece
            ((gameboard.board[0][0] == gameboard.board[1][0] && gameboard.board[1][0] == gameboard.board[2][0] && (gameboard.board[2][0] == 'X' || gameboard.board[2][0] == 'O'))) ||
            ((gameboard.board[0][0] == gameboard.board[1][1] && gameboard.board[1][1] == gameboard.board[2][2] && (gameboard.board[2][2] == 'X' || gameboard.board[2][2] == 'O')))
        ) {
            win = true;
            winner = gameboard.board[0][0];
        } else if ( // check for winner who ALSO touches the bottom right piece
            ((gameboard.board[0][2] == gameboard.board[1][2] && gameboard.board[1][2] == gameboard.board[2][2] && (gameboard.board[2][2] == 'X' || gameboard.board[2][2] == 'O'))) ||
            ((gameboard.board[0][0] == gameboard.board[1][1] && gameboard.board[1][1] == gameboard.board[2][2] && (gameboard.board[2][2] == 'X' || gameboard.board[2][2] == 'O')))

        ) {
            win = true;
            winner = gameboard.board[2][2];
        }

        // if (win === 'X')
        let winnerName = winner === 'X' ? playerOne.playerName : playerTwo.playerName;
        return { win, winner, winnerName } //##########################need to get winnername
    }

    // handles the modal/dialog for the end game message to cut down on code repetition
    function endGameDialog(messageInput) {

        const dialog = document.querySelector('.end-game');
        const endMessage = document.querySelector('.end-message');
        endMessage.textContent = messageInput;
        dialog.showModal();

        dialog.style.display = 'flex';
        dialog.style.justifyContent = 'space-around';
        dialog.style.transform = 'translate(-50%, -50%)';
    }
    // handles the start game dialog/modal.
    // we get the playernames, add them as labels, and start the game

    //WE ARE STUCK ON STARTGAMEDIALOG. THE DIALOG BOX POPS UP ON TOP OF THE 
    //TICTACTOE BOARD AND CLOSES AS EXPECTED. HOWEVER ONCE CLOSED WE CANNOT 
    // CLICK ON THE TICTACTOE BOARD ANYMORE. EVENTLISTENER ISSUE?
    // MAYBE INTEGRATE INTEGRATE THIS INTO THE EVENT LISTENER FOR 
    // HANDLEGAMECLICK?
    function startGameDialog() {
        const playerOneInput = document.querySelector('#playerOne');
        const playerTwoInput = document.querySelector('#playerTwo');

        const playerOneValue = playerOneInput.value;
        const playerTwoValue = playerTwoInput.value;

        //WE ADDED SETNAME TO THE PLAYER MODULE. TEST IF THESE LINES WORK
        // playerOne.setName(playerOneValue)
        // playerTwo.setName(playerTwoValue)

        //1) create the players
        const playerOne = createPlayer(playerOneValue, 'X');
        const playerTwo = createPlayer(playerTwoValue, 'O');
        //2) create a reference to the player labels in the html
        const playerOneLabel = document.querySelector('.player-1-name');
        const playerTwoLabel = document.querySelector('.player-2-name');
        //3) change the textcontent of the labels
        playerOneLabel.textContent = playerOne.playerName;
        playerTwoLabel.textContent = playerTwo.playerName;

        //4) get rid of the modal/dialog box
        const dialog = document.querySelector('.start-game');

        dialog.close();
        // setTimeout(() => {
        //     dialog.close();
        // }, 100);
        // dialog.style.display = 'none';




        // document.querySelector('.game-container').removeEventListener('click', handleGameClick)

    }
    const dialog = document.querySelector('.start-game');
    dialog.showModal()
    document.querySelector('.start-game-button').addEventListener('click', startGameDialog)

    // originally we had a while loop to control the flow of the game, 
    // but we swapped to event listeners because we couldn't get the while
    // loop to work 
    function handleGameClick(event) {
        if (!game_over) {
            const currentPlayer = turn_tracker % 2 === 0 ? playerOne : playerTwo;
            const index = event.target.dataset.index;

            if (index && event.target.classList.contains('square') && event.target.textContent === '') {
                const [row, col] = index.split('');
                gameboard.add_piece(Number(row), Number(col), currentPlayer.playerSymbol);
                displayLogic.renderBoard();

                if (winChecker().win) {
                    game_over = true;
                    // console.log('winner detected')
                    // console.log(`${winChecker().winner} wins!`)
                    // from here edit the dialog box that appears when win/tie

                    const endMessage = `${winChecker().winnerName} wins!`
                    endGameDialog(endMessage);


                } else if (tieChecker()) {
                    game_over = true;
                    // console.log('tie detected')
                    const endMessage = "It's a tie!"
                    endGameDialog(endMessage);
                } else {
                    turn_tracker++;
                }
            }
        }
    }
    document.querySelector('.game-container').addEventListener('click', handleGameClick);

})();

// NEXT TODO: 
// 1) add button to start/restart the game!
// 2) allow players to select a name
// 3) add a display element that shows the results when the game ends

// Create an object that will handle the DOM/Display logic
