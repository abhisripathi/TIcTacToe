const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const statusMessage = document.getElementById('status-message');
let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];
let playerXName = '';
let playerOName = '';

// Function to set the players' names and start the game

function startGame() {
    playerXName = document.getElementById('player-x-name').value || 'Player X';
    playerOName = document.getElementById('player-o-name').value || 'Player O';
    document.getElementById('name-form').style.display = 'none'; // Hide the name form
    document.getElementById('game-container').style.display = 'block'; // Show the game board
    createBoard();
}

/*              Comment 1

During our initial attempt to create the Tic Tac Toe board, 
we encountered an issue where the grid cells were aligning 
horizontally in a single row, rather than forming the traditional 
3x3 grid that we're familiar with. This was due to the fact that our 
original createBoard function was appending each cell directly to the 
gameBoard without creating distinct rows for them.

*/ 

/*                  Comment 2

Our initial createBoard function was designed to iterate over the boardState 
array and create a cell (td) for each element. 
These cells were then directly appended to the gameBoard. 
While this approach was straightforward, it led to all the cells being placed in a single row.

*/

//Function to create the board
// function createBoard() {
//     gameBoard.innerHTML = ''; // Clear the board
//     boardState.forEach((cell, index) => {
//         const td = document.createElement('td');
//         td.textContent = cell;
//         td.addEventListener('click', () => cellClicked(index));
//         gameBoard.appendChild(td);
//     });
//     statusMessage.textContent = `Player ${currentPlayer}'s turn`;
// }


/*                  Comment 3

To fix the above grid issue we modified the function as below.
"To fix the layout issue, we revised the createBoard function. 
Now, instead of appending cells directly to the gameBoard, we introduced a check 
to create a new table row (tr) after every three cells. This way, when the index of 
our cell is divisible by 3, indicating the start of a new row, we insert a new row into the gameBoard. 
We then insert the cell into the newly created row. As a result, we successfully 
formed a proper 3x3 grid, with each cell being correctly positioned within the grid.

*/

// Function to create the board
function createBoard() {
    gameBoard.innerHTML = ''; // Clear the board
    let row;
    boardState.forEach((cell, index) => {
        // Create a new row for every three cells
        if (index % 3 === 0) {
            row = gameBoard.insertRow();
        }
        const cellElement = row.insertCell();
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => cellClicked(index));
    });
    statusMessage.textContent = `Player ${currentPlayer}'s turn`;

}


/*
The cellClicked function in our Tic Tac Toe game is responsible for what 
happens when a player clicks on a cell in the grid.

When you click on one of the squares in the Tic Tac Toe grid, 
the cellClicked function gets called with the specific position (or index) 
of that cell in the grid. The function first checks two things:

If the cell is already filled with an 'X' or an 'O', meaning it has been played, or,
If the game is currently paused (not active).
If either condition is true, the function simply ends, and nothing happens.

If the cell is empty and the game is active, the function will mark the cell 
with the current player's symbol, either an 'X' or an 'O'. After that, it updates 
the board to show this new move by calling the createBoard function. 

Lastly, it checks the status of the game by calling checkGameStatus to see if this 
move has resulted in a win or a tie. If there's a winner, or if all cells are filled 
without a winner (a tie), the game will end. Otherwise, it switches to the other player's turn.*/

// Function to handle cell click
function cellClicked(index) {
    if (boardState[index] !== '' || !gameActive) {
        return; // Cell is already taken or the game is paused
    }
    boardState[index] = currentPlayer;
    createBoard();
    checkGameStatus();
}

/*
Checking for a win condition.
If a win is detected, we determine the winner's name based on the 
current player's symbol ('X' or 'O') and display it.
If there's a tie, we display the tie message.
If the game is still ongoing, we switch to the other player and update the status message accordingly.
*/

// Function to check the game's status for a win or a tie
function checkGameStatus() {
    const winConditions = [
        [0, 1, 2], // Rows
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // Columns
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // Diagonals
        [2, 4, 6]
    ];

    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        const a = boardState[winCondition[0]];
        const b = boardState[winCondition[1]];
        const c = boardState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {

        if (roundWon) {
            let winnerImageId = currentPlayer === 'X' ? 'player-1-win' : 'player-2-win';
            document.getElementById(winnerImageId).style.display = 'block'; // Show win image
            document.getElementById('game-container').style.display = 'none'; // Hide game board
        }
        
        let winnerName = currentPlayer === 'X' ? playerXName : playerOName;
        statusMessage.textContent = `${winnerName} wins!`;
        gameActive = false;
        stopTimer(); // Stop the timer because the game has been won
        return;
    } else {
        const roundTie = !boardState.includes('');
        if (roundTie) {
            statusMessage.textContent = `It's a tie!`;
            document.getElementById('tie-game').style.display = 'block';
            document.getElementById('game-container').style.display = 'none'; // Hide game board
            gameActive = false;
            stopTimer(); // Stop the timer because the game is a tie
            showRestartButton();  
            return;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatusMessage(); 
        }
    }
}

function showRestartButton() {
    document.getElementById('restart-button').style.display = 'block'; // Show the restart button
    document.getElementById('restart-button').addEventListener('click', resetGame);
}

function hideRestartButton() {
    document.getElementById('restart-button').style.display = 'none'; // Hide the restart button
}

function updateStatusMessage() {
    const currentPlayerName = currentPlayer === 'X' ? playerXName : playerOName;
    statusMessage.textContent = `${currentPlayerName}'s turn`;
}

// Make sure to call hideImages() inside the resetGame function to reset the images
function hideImages() {
    document.getElementById('player-1-win').style.display = 'none';
    document.getElementById('player-2-win').style.display = 'none';
    document.getElementById('tie-game').style.display = 'none';
}

// Function to reset the game
function resetGame() {

    if (timerId) {
        clearInterval(timerId);
    }
    document.getElementById('tie-game').style.display = 'none';
    currentPlayer = 'X';
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    stopTimer(); // Stop the timer because the game is being reset
    startGame();
    hideRestartButton();
    document.getElementById('new-challenge-button').style.display = 'block'; // Show the new challenge button
}

// Function to start a new challenge
function startNewChallenge() {
    // Code to start a new challenge or level
    // This can include setting up a new game state or redirecting to a new challenge
    document.getElementById('new-challenge-button').style.display = 'none'; // Hide the new challenge button again
}

function endGame() {
    gameActive = false; // Stop the game
    boardState.fill(''); // Clear the board state
    createBoard(); // Update the board visually
    hideImages();
    document.getElementById('status-message').textContent = 'Game has ended. Thanks for playing!';
    hideRestartButton();
    document.getElementById('end-game-button').style.display = 'none'; // Optionally hide the end game button
    // Optionally, you could redirect to another page or show a final screen here
}

let timerDuration = 30; // Timer duration in seconds
let timerId;

function updatePage() {
    // Initialize the timer
    document.getElementById('timer-container').style.display = 'block';
    document.getElementById('timer').textContent = `Time left: ${timerDuration} seconds`;
    
    // Start the countdown
    timerId = setInterval(function() {
        timerDuration -= 1;
        document.getElementById('timer').textContent = `Time left: ${timerDuration} seconds`;

        // When timer runs out, end the game
        if (timerDuration <= 0) {
            clearInterval(timerId);
            document.getElementById('timer').textContent = `Time's up!`;
            endGameDueToTimeout();
        }
    }, 1000); // Update the timer every second

    // Hide the update page button as the new challenge is now active
    document.getElementById('update-page-button').style.display = 'none';
}

// Function to end the game due to a timeout
function endGameDueToTimeout() {
    gameActive = false; // Disable the game
    statusMessage.textContent = `Time's up! Game over.`;
    // Show any additional messages or options here
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerId);
    document.getElementById('timer-container').style.display = 'none';
}

// Event listener for reset button
resetButton.addEventListener('click', resetGame);

// Initialize the game
createBoard();
