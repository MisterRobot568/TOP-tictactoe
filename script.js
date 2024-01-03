// 1) create a gameboard function with a gameboard array to store the game. 
// since we'll only need one instance of a gameboard object, wrap the factory in 
// an IIFE (this creates a module)

const gameboard = (function () {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    const add_piece = (x, y, player) => board[x][y] = player
    return { add_piece, board }
})();

// 2) create the player object as a factory. This will keep track of each player
// and their symbol (x or o), and name

function createPlayer(name, symbol) {
    let playerName = name;
    let playerSymbol = symbol;

    // const getName = () => playerName;
    // const getSymbol = () => playerSymbol;

    return { playerName, playerSymbol };
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
    const playerOne = createPlayer('playerOne', 'X');
    const playerTwo = createPlayer('playerTwo', 'O');

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
        return { win, winner }
    }

    // while (!game_over) {
    //     if (turn_tracker % 2 === 0) {
    //         // WE"RE STUCK ON THIS SECTION////////////////////////////////////////////
    //         //FIRST TRY
    //         // let x_coord = prompt(`${playerOne.playerName} What is your x? `);
    //         // let y_coord = prompt(`${playerOne.playerName} What is your y? `);
    //         // gameboard.add_piece(Number(x_coord), Number(y_coord), playerOne.playerSymbol);
    //         //SECOND TRY
    //         // const piece_coords = displayLogic('X')
    //         // console.log(piece_coords)

    //         // const x_coord = piece_coords[0];
    //         // const y_coord = piece_coords[1];
    //         // gameboard.add_piece(Number(x_coord), Number(y_coord), 'X')
    //         //THIRD TRY
    //         // const x_move = displayLogic('X');
    //         // document.querySelector('.game-container').addEventListener('click', x_move.handleSpaceClick)
    //         displayLogic.handleSpaceClick('X');




    //     } else {
    //         displayLogic.handleSpaceClick('O');
    //         // let x_coord = prompt(`${playerTwo.playerName} What is your x? `);
    //         // let y_coord = prompt(`${playerTwo.playerName} What is your y? `);
    //         // gameboard.add_piece(Number(x_coord), Number(y_coord), playerTwo.playerSymbol);
    //         // const piece_coords = displayLogic('O')

    //         // const x_coord = piece_coords[0];
    //         // const y_coord = piece_coords[1];
    //         // gameboard.add_piece(Number(x_coord), Number(y_coord), 'O')

    //     }
    //     turn_tracker++;
    //     // console.log(gameboard.board);
    //     // console.log(winChecker().win)
    //     if (winChecker().win) {
    //         game_over = true;
    //         console.log('winner detected')
    //         console.log(`${winChecker().winner} wins!`)
    //         break;
    //     } else if (tieChecker()) {
    //         game_over = true;
    //         console.log('tie detected')
    //     }
    // }

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
                    console.log('winner detected')
                    console.log(`${winChecker().winner} wins!`)
                } else if (tieChecker()) {
                    game_over = true;
                    console.log('tie detected')
                } else {
                    turn_tracker++;
                }
            }
        }
    }
    document.querySelector('.game-container').addEventListener('click', handleGameClick);

})();

// Create an object that will handle the DOM/Display logic


// function handleSpaceClick(event) {
//     const clickedSpace = event.target;
//     if (clickedSpace.classList.contains('square')) {
//         const index = clickedSpace.dataset.index;

//         if (clickedSpace.textContent === '') {
//             clickedSpace.textContent = symbol;
//             return clickedSpace.dataset.index
//         }
//     }
// }

// }

// displayLogic.renderBoard();