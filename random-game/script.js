const gameWrapper = document.querySelector('.game_wrapper');

let boxGame = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
let score = 0;
const rows = 4;
const columns = 4;

window.addEventListener('load', setGameBox);

function setGameBox() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let box = document.createElement('div');
            box.classList.add('game_box');
            gameWrapper.appendChild(box);
        }
    }
}