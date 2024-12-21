let isSolutionShown = false; // Track if the solution was shown

function generateNewPuzzle() {
    const difficulty = getDifficulty();

    fetch('/new_puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: difficulty })
    })
    .then(response => response.json())
    .then(puzzle => {
        updateBoard(puzzle);
        enableCheckAnswer(); // Re-enable the "Check Answer" button when a new puzzle is generated
        isSolutionShown = false; // Reset the flag
    })
    .catch(error => console.error('Error fetching new puzzle:', error));
}

function showSolution() {
    fetch('/show_solution', { method: 'POST' })
        .then(response => response.json())
        .then(solution => {
            updateBoard(solution);
            disableCheckAnswer(); // Disable the "Check Answer" button after showing the solution
            isSolutionShown = true; // Set the flag to indicate the solution was shown
        })
        .catch(error => console.error('Error fetching solution:', error));
}

function checkAnswer() {
    if (isSolutionShown) {
        alert("You haven't solved the Sudoku yourself, so your solution won't be counted.");
        return;
    }

    const board = [];
    for (let row = 0; row < 9; row++) {
        const boardRow = [];
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`input[name="cell-${row}-${col}"]`);
            if (cell.value === "") {
                alert("Please fill all the boxes before checking the answer.");
                return;
            }
            boardRow.push(parseInt(cell.value));
        }
        board.push(boardRow);
    }

    fetch('/check_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: board })
    })
    .then(response => response.json())
    .then(data => {
        if (data.correct) {
            alert("Congratulations! Your solution is correct.");
        } else {
            alert("Oops! Your solution is incorrect.");
        }
    })
    .catch(error => console.error('Error checking answer:', error));
}

function updateBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`input[name="cell-${row}-${col}"]`);
            cell.value = board[row][col] !== 0 ? board[row][col] : '';
            cell.readOnly = board[row][col] !== 0;
        }
    }
}

function getDifficulty() {
    const sliderValue = document.getElementById('difficulty-slider').value;
    return sliderValue == 1 ? 'easy' : sliderValue == 2 ? 'medium' : 'hard';
}

function updateDifficultyLabel(value) {
    const label = document.getElementById('difficulty-label');
    label.textContent = value == 1 ? 'Easy' : value == 2 ? 'Medium' : 'Hard';
}

// Utility functions to disable and enable the "Check Answer" button
function disableCheckAnswer() {
    const checkAnswerButton = document.querySelector('button[onclick="checkAnswer()"]');
    checkAnswerButton.disabled = true;
}

function enableCheckAnswer() {
    const checkAnswerButton = document.querySelector('button[onclick="checkAnswer()"]');
    checkAnswerButton.disabled = false;
}