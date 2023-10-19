console.log("Итог: 60 баллов. По пунктам:\nВёрстка +10: реализован интерфейс игры +5, в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5\nЛогика игры. Ходы, перемещения фигур, другие действия игрока подчиняются определённым свойственным игре правилам +10\nРеализовано завершение игры при достижении игровой цели +10\nПо окончанию игры выводится её результат, например, количество ходов, время игры, набранные баллы, выигрыш или поражение и т.д. При выигрыше(сборе 2048) выводится модальное окно с поздравлением, результатом, вопросом, желает ли игрок продолжить эту игру или начать новую(с соответствубщими кнопками). При проигрыше(если все поля заполнены и дальше позодить нельзя), выводится модальное окно с результатом игры и кнопкой для ночала новой.nЕсть таблица результатов, в которой сохраняются результаты 10 игр с наибольшим счетом (лучшим временем и т.п.) или просто 10 последних игр (хранится в local storage). Таблица открывается при клике на кнопку со звездочкой в руках +10\nАнимации или звуки, или настройки игры. Есть фоновый звук, который можно убрать кликом на специальную кнопку +10")

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
const openRatingBtn = document.querySelector('.rating_btn');
const ratingTable = document.querySelector('.rating-table');
const closeBtn = document.querySelector('.rating_close');
const helpModalWindow = document.querySelector('.help');
const helpCloseBtn = document.querySelector('.help_close');
const helpOpenBtn = document.querySelector('.ask_btn');
const tableBody = document.querySelector('tbody');
const volumeBtn = document.querySelector('.volume');
const volumeBtnNone = document.querySelector('.volume_none');
const haveVolumeBtn = document.querySelector('.volume_visible');

let boxGame;
let audio = new Audio();
let score = 0;

const rowsBox = 4;
const columnsBox = 4;

let resultGameArr = [];

window.addEventListener('load', () => {
    setGameBox();
    alert("Игра всё ещё в процессе разработки, буду благодарна, если посмотрите через несколько дней =)");
    playAudio();
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

openRatingBtn.addEventListener('click', openRatingTable);

closeBtn.addEventListener('click', closeRatingTable);

helpOpenBtn.addEventListener('click', openHelpModalWindow);
helpCloseBtn.addEventListener('click', closeHelpModalWindow);

volumeBtn.addEventListener('click', removeVolumeAudio);

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

    if (e.code !== "ArrowLeft" && e.code !== "ArrowRight" && e.code !== "ArrowUp" && e.code !=="ArrowDown") {
        return;
    }

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
    // setDataInTable();
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

    // setDataInTable();
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

let resultArr;

function getLocalStorage() {
    resultArr = JSON.parse(localStorage.getItem('result'));
}

getLocalStorage();

function openRatingTable() {
    overlay.classList.add('overlay_add');
    ratingTable.classList.add('rating-table_visible');
    setDataInTable();
}

function closeRatingTable() {
    overlay.classList.remove('overlay_add');
    ratingTable.classList.remove('rating-table_visible');
}

function setDataInTable() {
    getLocalStorage();
    tableBody.innerHTML = "";

    if (resultArr?.length == 0) {
        return;
    }

    let resultArrSort = resultArr?.sort((a, b) => b - a).slice(0, 10);

    resultArrSort?.forEach(item => {
        let tr = document.createElement('tr');
        tableBody.appendChild(tr);

        let td = document.createElement('td');
        td.classList.add('table_line');
        td.textContent = item;
        tr.appendChild(td);
    })
}

function openHelpModalWindow() {
    helpModalWindow.classList.add('help_visible');
    overlay.classList.add('overlay_add');
}

function closeHelpModalWindow() {
    helpModalWindow.classList.remove('help_visible');
    overlay.classList.remove('overlay_add');
}

function playAudio() {
    audio.src = './assets/derevnja-durakov-soundtrack-kalambur.mp3';
    audio.play();
    audio.loop = true;
}

function removeVolumeAudio() {
    if(audio && volumeBtn.classList.contains("volume_visible")) {
        audio.muted = true;
        volumeBtn.classList.remove("volume_visible");
        volumeBtn.classList.add("volume_none");
    } else if(audio && volumeBtn.classList.contains("volume_none")) {
        audio.muted = false;
        volumeBtn.classList.add("volume_visible");
        volumeBtn.classList.remove("volume_none");
    }
}