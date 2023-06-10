const gridcontainer = document.querySelector('.grid-container');

const startnode = [4, 7];
let direction = [0, 1];
let Grid = [];

let isMousePressed = false;



function toggleWall(i, j) {
    const cell = Grid[i][j];
    cell.classList.toggle('wall');
}


//Create Grid
for (let i = 0; i < 17; i++) {
    Grid[i] = [];
    for (let j = 0; j < 50; j++) {
        const gridElement = document.createElement('div');
        gridElement.className = 'grid';

        gridElement.onclick = () => toggleWall(i, j);
        gridElement.onmousedown = () => { isMousePressed = true; };
        gridElement.onmouseup = () => { isMousePressed = false; };
        gridElement.onmouseenter = () => { if (isMousePressed) toggleWall(i, j); };

        gridcontainer.appendChild(gridElement);
        Grid[i][j] = gridElement;
    }
}
//Create Grid

// Cell check
function chk(row, col) {
    if (row < 0) {
        row = 16;
    }
    if (row == 17) {
        row = 0;
    }
    if (col < 0) {
        col = 49;
    }
    if (col == 50) {
        col = 0;
    }
    return [row, col];
}
//Cell check

let cur = startnode.slice();

// the actual snake
class Node {
    constructor(datax, datay) {
        this.data = [datax, datay];
        this.next = null;
    }
}
let Head = new Node(startnode[0], startnode[1]);

// the actual snake


//Keyboard Control
function moveStartNode(event) {
    const key = event.key;

    if (key == "ArrowUp" && !(direction[0] === 1 && direction[1] === 0)) {
        direction = [-1, 0];
    }
    else if (key == "ArrowDown" && !(direction[0] === -1 && direction[1] === 0)) {
        direction = [1, 0]
    }
    else if (key == "ArrowLeft" && !(direction[0] === 0 && direction[1] === 1)) {
        direction = [0, -1];
    }
    else if (key == "ArrowRight" && !(direction[0] === 0 && direction[1] === -1)) {
        direction = [0, 1];
    }

}
document.addEventListener("keydown", moveStartNode);
//Keyboard Control

//sleep
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//sleep

//Random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Random

//Maze
function lucky(i, j, k) {
    if (k !== 0) {
        let luck = getRandomInt(2, 4);
        if (luck % 2 == 1) {
            lucky(i, j, k - 1);
        }
    }
    else {
        Grid[i][j].classList.add("wall");
        let z = getRandomInt(1, 2);
        if (z == 1 && !Grid[i][(j + 1) % 50].classList.contains("start"))
            Grid[i][(j + 1) % 50].classList.add("wall");
        else if (!Grid[(i + 1) % 17][j].classList.contains("start"))
            Grid[(i + 1) % 17][j].classList.add("wall");
    }
}

function CreateMaze() {
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 50; j++) {
            if (Grid[i][j].classList.contains("start"))
                continue;
            lucky(i, j, 3);
        }
    }
}
//Maze

function Maze() {

    Grid[startnode[0]][startnode[1]].classList.add('start');
    cur = startnode.slice();
    CreateMaze();
    direction = [0, 1];
}

//Bonus
let bonus = false;
let bonustimer;
let bonuscount=0;
function Bonus() {
    bonus = true;
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 50; j++) {
            if (Grid[i][j].classList.contains('wall') || Grid[i][j].classList.contains('start'))
                continue;
            else {
                let luck1 = getRandomInt(2, 6);
                if (luck1 == 6) {
                    let luck = getRandomInt(1, 3);
                    if (luck == 1)
                        Grid[i][j].classList.add("fruit1");
                    else if (luck == 2)
                        Grid[i][j].classList.add("fruit2");
                    else
                        Grid[i][j].classList.add("fruit3");
                }
            }
        }
    }
    bonustimer = setTimeout(stopbonus, 5000);
}
function stopbonus() {
    bonus = false;
    bonuscount=0;
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 50; j++) {
            Grid[i][j].classList.remove("fruit1", "fruit2", "fruit3");
        }
    }
    createfruit();
}
// ///// Everything
function movenode() {

    let [row, col] = cur;
    [row, col] = chk(row + direction[0], col + direction[1]);
    if (Grid[row][col].classList.contains("wall") || (Grid[row][col].classList.contains("start"))) {
        showgameoverbox();
        return;
    }
    let has = false;
    if (Grid[row][col].classList.contains("fruit1") || Grid[row][col].classList.contains("fruit2") || Grid[row][col].classList.contains("fruit3")) {
        Grid[row][col].classList.remove("fruit1");
        Grid[row][col].classList.remove("fruit2");
        Grid[row][col].classList.remove("fruit3");
        points++;
        if(bonus===false)
            bonuscount++;
        if (bonuscount % 10 == 0 && bonus == false)
            Bonus();
        else if (bonus == false)
            createfruit();
        has = true;

    }
    if (has === false || bonus == true) {
        Grid[cur[0]][cur[1]].classList.remove("start");
        Grid[row][col].classList.add("start");
        cur = [row, col];
        let newNode = new Node(row, col);
        let temp2 = Head;
        let temp3 = Head.next;
        Head = newNode;
        let temp = Head;
        while (temp3 != null) {
            Grid[temp3.data[0]][temp3.data[1]].classList.remove("start");
            Grid[temp2.data[0]][temp2.data[1]].classList.add("start");
            temp.next = temp2;
            temp = temp2;
            temp2 = temp3;
            temp3 = temp3.next;

        }
        temp.next = null;
        point_display();
    }
    else {
        Grid[row][col].classList.add("start");
        cur = [row, col];
        let newNode = new Node(row, col);
        newNode.next = Head;
        Head = newNode;
    }
}
//Everything

//Create Fruit
function createfruit() {
    let row = getRandomInt(0, 16);
    let col = getRandomInt(0, 49);
    if (Grid[row][col].classList.contains("wall") || Grid[row][col].classList.contains("start")) {
        createfruit();
        return;
    }
    let luck = getRandomInt(1, 3);
    if (luck == 1)
        Grid[row][col].classList.add("fruit1");
    else if (luck == 2)
        Grid[row][col].classList.add("fruit2");
    else
        Grid[row][col].classList.add("fruit3");
}

//points
let points = 0;
function point_display() {
    const pointdisplay = document.getElementById("Point-display");
    pointdisplay.textContent = "Score: " + points;
}
point_display();
//points

//Create Fruit
let Gameon = null;
//Start
async function start() {
    if (Gameon !== null) {
        clearInterval(Gameon);
        Gameon = null;
    }
    Head = new Node(startnode[0], startnode[1]);
    points = 0;
    point_display();

    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 50; j++) {
            console.log(i, j);
            Grid[i][j].classList.remove('wall', 'fruit1', 'fruit2', 'fruit3', 'start');
        }
    }
    console.log("djmaldkal");
    Maze();
    createfruit();
    await sleep(1500);
    if (Gameon === null)
        Gameon = setInterval(movenode, 200);
}
//start


//Game over

const gameOverBox = document.createElement("div");
gameOverBox.id = "game-over-box";
gameOverBox.innerHTML = `
        <h1>Game Over</h1>
        <p>Your Score is: <span id="score-value"></span></p>
        <button id="restart-btn">Restart</button>
        <button id="quit-btn">Quit</button>
`;
document.body.appendChild(gameOverBox);
document.getElementById("restart-btn").addEventListener("click", restartgame);
document.getElementById("quit-btn").addEventListener("click", quitgame);

function showgameoverbox() {
    console.log(1000);
    document.getElementById("score-value").textContent = points;
    document.getElementById("game-over-box").style.display = "block";
}

function restartgame() {
    window.location.href = "snake.html";
}
function quitgame() {
    window.location.href = "../category.html";
}
//Game over