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

    while (!game_over) {
        if (turn_tracker % 2 === 0) {
            let x_coord = prompt(`${playerOne.playerName} What is your x? `);
            let y_coord = prompt(`${playerOne.playerName} What is your y? `);
            gameboard.add_piece(Number(x_coord), Number(y_coord), playerOne.playerSymbol);
        } else {
            let x_coord = prompt(`${playerTwo.playerName} What is your x? `);
            let y_coord = prompt(`${playerTwo.playerName} What is your y? `);
            gameboard.add_piece(Number(x_coord), Number(y_coord), playerTwo.playerSymbol);
        }
        turn_tracker++;
        // console.log(gameboard.board);
        // console.log(winChecker().win)
        if (winChecker().win) {
            game_over = true;
            console.log('winner detected')
            console.log(`${winChecker().winner} wins!`)
            break;
        } else if (tieChecker()) {
            game_over = true;
            console.log('tie detected')
        }
    }

})();

// STILL NEED TO IMPLEMENT THE LOGIC TO CHECK FOR WINNER/ DRAW