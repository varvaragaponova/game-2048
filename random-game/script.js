const gameWrapper = document.querySelector('.game_wrapper');

let boxGame;

let score = 0;

const rowsBox = 4;
const columnsBox = 4;

window.addEventListener('load', setGameBox);

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

    setNewCellNumber();
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
}

document.addEventListener('keyup', (e) => {
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
                console.log(numInBox);
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
    setNewCellNumber();
    // console.log(e.code);
})

function sliderBox(row) {
    row = row.filter(item => item!== 0);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] = row[i] * 2;
            row[i + 1] = 0;
        }
    }

    row = row.filter(item => item!== 0);

    do {
        row.push(0);
    } while (row.length < columnsBox);

    return row;
}

function setNewCellNumber() {

    let isCellEmpty;

    for (let i = 0; i <rowsBox; i++) {
        for (let j = 0; j < columnsBox; j++) {
            if(boxGame[i][j] === 0) {
                isCellEmpty = true;
            } else {
                isCellEmpty = false;
            }
        }
    }

    if (!isCellEmpty) {
        return;
    } else {
        let isAvailablePlaceFounded = false;

        while (!isAvailablePlaceFounded) {
            let numberForRow = Math.floor(Math.random() * rowsBox);
            let numberForColumn = Math.floor(Math.random() * columnsBox);

            if (boxGame[numberForRow][numberForColumn] === 0) {
                let randomNumber = Math.round(Math.random(0, 1));
                if (randomNumber === 0) {
                    boxGame[numberForRow][numberForColumn] = 2;
                    let cell = document.getElementById(`${numberForRow}-${numberForColumn}`);
                    cell.innerText = "2";
                    cell.classList.add("box_2");
                    isAvailablePlaceFounded = true;
                } else {
                    boxGame[numberForRow][numberForColumn] = 4;
                    let cell = document.getElementById(`${numberForRow}-${numberForColumn}`);
                    cell.innerText = "4";
                    cell.classList.add("box_4");
                    isAvailablePlaceFounded = true;
                }
            }
        }
    }
}