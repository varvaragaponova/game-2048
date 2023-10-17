const gameWrapper = document.querySelector('.game_wrapper');
const overlay = document.querySelector('.overlay');
const gameOverModalWindow = document.querySelector('.game-over');
const newGameBtn = document.querySelector('.game-over_btn');
const scoreNumber = document.querySelector('.score_number');
const resultText = document.querySelector('.result_number');
const winnerModalWindow = document.querySelector('.winner');
const continueBtn = document.querySelector('.continue_btn');
const winnerScore = document.querySelector('.winner_number');
const newGameButton = document.querySelector('.new-game_btn');

let boxGame;

let score = 0;

const rowsBox = 4;
const columnsBox = 4;

let resultGameArr = [];

window.addEventListener('load', () => {
    setGameBox();
    alert("Игра всё ещё в процессе разработки, буду благодарна, если посмотрите через несколько дней =)");
});

newGameBtn.addEventListener('click', startNewGame);

newGameButton.addEventListener('click', () => {
    overlay.classList.remove('overlay_add');
    winnerModalWindow.classList.remove('winner_add');
    startNewGame();
});

continueBtn.addEventListener('click', () => {
    overlay.classList.remove('overlay_add');
    winnerModalWindow.classList.remove('winner_add');
})

function setGameBox() {
    boxGame = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let i = 0; i < rowsBox; i++) {
        for (let j = 0; j < columnsBox; j++) {
            let cell = document.createElement('div');
            // cell.classList.add('game_box');
            // cell.classList.add('color_basic');
            gameWrapper.appendChild(cell);
            let numInBox = boxGame[i][j];
            updateCell(cell, numInBox);

            cell.setAttribute('id', `${i}-${j}`);
        }
    }

    setNewCellNumber(true);
}

function updateCell(cell, numInBox) {
    cell.innerText = '';
    cell.classList.value = '';
    cell.classList.add('game_box');

    if (numInBox == 0) {
        cell.classList.add('color_basic');
    } else if (numInBox <= 4096) {
        cell.classList.remove('color_basic');
        cell.classList.add(`box_${numInBox}`);
    } else {
        cell.classList.add('box_8192');
        cell.classList.remove('color_basic');
    }

    if (numInBox > 0) {
        cell.innerText = numInBox;
    };

    isWinner(cell);
}

document.addEventListener('keyup', onKeyUp);

function onKeyUp(e) {
    if (e.code === "ArrowLeft") {
        for (let i = 0; i < rowsBox; i++) {
            let row = boxGame[i];
            row = sliderBox(row);
            boxGame[i] = row;

            for (let j = 0; j < columnsBox; j++) {
                let cell = document.getElementById(`${i}-${j}`);
                let numInBox = boxGame[i][j];
                updateCell(cell, numInBox);
            }
        }
        // setNewCellNumber();
    } else if (e.code === "ArrowRight") {
        for (let i = 0; i < rowsBox; i++) {
            let row = boxGame[i];
            row.reverse();
            row = sliderBox(row);
            row.reverse();
            boxGame[i] = row;

            for (let j = 0; j < columnsBox; j++) {
                let cell = document.getElementById(`${i}-${j}`);
                let numInBox = boxGame[i][j];
                updateCell(cell, numInBox);
            }
        }
        // setNewCellNumber();
    } else if (e.code === "ArrowUp") {
        for (let i = 0; i < columnsBox; i++) {
            let column = [boxGame[0][i], boxGame[1][i], boxGame[2][i], boxGame[3][i]];
            column = sliderBox(column);
            boxGame[0][i] = column[0];
            boxGame[1][i] = column[1];
            boxGame[2][i] = column[2];
            boxGame[3][i] = column[3];

            for (let j = 0; j < rowsBox; j++) {
                let cell = document.getElementById(`${j}-${i}`);
                let numInBox = boxGame[j][i];
                // console.log(numInBox);
                updateCell(cell, numInBox);
            }
        }
        // setNewCellNumber();
    } else if (e.code === "ArrowDown") {
        for (let i = 0; i < columnsBox; i++) {
            let column = [boxGame[0][i], boxGame[1][i], boxGame[2][i], boxGame[3][i]];
            column.reverse();
            column = sliderBox(column);
            column.reverse();
            boxGame[0][i] = column[0];
            boxGame[1][i] = column[1];
            boxGame[2][i] = column[2];
            boxGame[3][i] = column[3];

            for (let j = 0; j < rowsBox; j++) {
                let cell = document.getElementById(`${j}-${i}`);
                let numInBox = boxGame[j][i];
                updateCell(cell, numInBox);
            }
        }
        // setNewCellNumber();
    }
    scoreNumber.innerText = `${score}`;
    setNewCellNumber();
    isGameOver();
    // console.log(e.code);
}

function sliderBox(row) {
    row = row.filter(item => item!== 0);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] = row[i] * 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = row.filter(item => item!== 0);

    while (row.length < columnsBox) {
        row.push(0);
    };

    // console.log(boxGame);
    // isGameOver();
    return row;
}

function setNewCellNumber(isNewGame) {

    let isCellEmpty = true;

    for (let i = 0; i < rowsBox; i++) {
        for (let j = 0; j < columnsBox; j++) {
            if(boxGame[i][j] == 0) {
                isCellEmpty = true;
            } else {
                isCellEmpty = false;
            }
        }
    }

    // console.log(isCellEmpty);

    if (!isCellEmpty) {
        return;
    } else {
        let isAvailablePlaceFounded = false;

        while (!isAvailablePlaceFounded) {
            let numberForRow = Math.floor(Math.random() * rowsBox);
            let numberForColumn = Math.floor(Math.random() * columnsBox);

            if (boxGame[numberForRow][numberForColumn] === 0) {
                let randomNumber = Math.round(Math.random(0, 1));
                // console.log(randomNumber, 111);
                if (randomNumber === 0) {
                    boxGame[numberForRow][numberForColumn] = 2;

                    // if (isNewGame) {
                    //     score += 2;
                    //     scoreNumber.innerText = 2;
                    // }

                    let cell = document.getElementById(`${numberForRow}-${numberForColumn}`);
                    cell.innerText = "2";
                    cell.classList.add("box_2");
                    cell.style = 'transition: all .5s';
                    isAvailablePlaceFounded = true;
                } else {
                    boxGame[numberForRow][numberForColumn] = 4;

                    // if (isNewGame) {
                    //     score += 4;
                    //     scoreNumber.innerText = 4;
                    // }

                    let cell = document.getElementById(`${numberForRow}-${numberForColumn}`);
                    cell.innerText = "4";
                    cell.classList.add("box_4");
                    cell.style = 'transition: all .5s';
                    isAvailablePlaceFounded = true;
                }
            }
        }
    }
}

function isGameOver() {
    let possibleMoves = 0;
    for(let i = 0; i < rowsBox; i++) {
        for(let j = 0; j < columnsBox; j++) {
            if (i !== rowsBox - 1 && boxGame[i+1][j] === boxGame[i][j]) {
                possibleMoves++;
            }
            if (j !== columnsBox - 1 && boxGame[i][j + 1] === boxGame[i][j]) {
                possibleMoves++;
            }
        }
    }

    if (possibleMoves === 0 && !boxGame.flat(2).includes(0)) {
        overlay.classList.add('overlay_add');
        gameOverModalWindow.classList.add('game-over_visible');
        resultText.innerText = score;
        document.removeEventListener('keyup', onKeyUp);
        setLocalStorage();
    }
}

function startNewGame() {
    overlay.classList.remove('overlay_add');
    gameOverModalWindow.classList.remove('game-over_visible');
    for (let i = 0; i < rowsBox; i++) {
        for (let j = 0; j < columnsBox; j++) {
            boxGame[i][j] = 0;
            updateCell(document.getElementById(`${i}-${j}`), 0);
        }
    };
    setNewCellNumber();
    score = 0;
    scoreNumber.innerText = 0;
    isFinish = false;
    document.addEventListener('keyup', onKeyUp);
}

let isFinish = false;

function isWinner(cell) {
    if (!isFinish) {
        if(cell.classList.contains('box_2048')) {
            overlay.classList.add('overlay_add');
            winnerModalWindow.classList.add('winner_add');
            winnerScore.innerText = score;
            isFinish = true;
        }
    }

    document.addEventListener('keyup', onKeyUp);
    return;
}

function setLocalStorage() {
    let item = JSON.parse(localStorage.getItem('result'));

    if (item) {
        localStorage.setItem('result', JSON.stringify([...item, score]));
    } else {
        localStorage.setItem('result', JSON.stringify([score]));
    }
}