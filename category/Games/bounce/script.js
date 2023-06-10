const gridcontainer = document.querySelector('.grid-container');

let startnode = [4, 7];
const desnode = [9, 29];
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


let cur = startnode.slice();

async function jump() {
    let [row, col] = cur.slice();
    for (let i = 0; i < 3; i++) {
        row--;
        [row, col] = chk(row, col);

        if (Grid[row][col].classList.contains("wall"))
            return;
        if (Grid[row][col].classList.contains("worm") || Grid[row][col].classList.contains("dragon") || Grid[row][col].classList.contains("spider")) {
            showgameoverbox();
            return;
        }
        if (row == desnode[0] && col == desnode[1]) {
            showwinbox();
            return;
        }
        await sleep(40);
        Grid[cur[0]][cur[1]].classList.remove("start");
        Grid[row][col].classList.add("start");
        cur = [row, col];
        startnode = cur;
    }
}
let arrowflag = false;
let arrowchk;
function Arrowflag() {
    let [row, col] = cur;
    [row, col] = chk(row + 1, col);
    if (Grid[row][col].classList.contains("worm") || Grid[row][col].classList.contains("dragon") || Grid[row][col].classList.contains("spider")) {
        showgameoverbox();
        return;
    }
    if (Grid[row][col].classList.contains("wall")) {
        clearInterval(arrowchk);
        arrowflag = false;
    }
}
function moveStartNode(event) {
    const key = event.key;


    let [row, col] = cur;
    if (key == "ArrowUp" && arrowflag == false) {
        // clearInterval(Gravity);
        arrowflag = true;
        jump();
        arrowchk = setInterval(Arrowflag, 100);
        // Gravity=null;
    }
    else if (key == "ArrowDown") {
        row++;
    }
    else if (key == "ArrowLeft") {
        col--;
    }
    else if (key == "ArrowRight") {
        col++;
    }
    [row, col] = chk(row, col);
    if (Grid[row][col].classList.contains("worm") || Grid[row][col].classList.contains("dragon") || Grid[row][col].classList.contains("spider")) {
        showgameoverbox();
        return;
    }
    if (row == desnode[0] && col == desnode[1]) {
        showwinbox();
        return;
    }
    if (Grid[row][col].classList.contains("wall"))
        return;
    // if(Grid[row][col].classList.contains("des"))

    Grid[cur[0]][cur[1]].classList.remove("start");
    Grid[row][col].classList.add("start");
    cur = [row, col];
    startnode = cur;
}


document.addEventListener("keydown", moveStartNode);

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let now = 0;
function animal(i, j, k) {
    luck = getRandomInt(2, 4);
    if (luck % 2 == 1) {
        if (k == 0) {
            if (now == 0)
                Grid[i][j].classList.add("spider");
            else if (now == 1)
                Grid[i][j].classList.add("dragon");
            else
                Grid[i][j].classList.add("worm");
            now++; now %= 3;
        }
        else animal(i, j, k - 1);
    }
}
function CreateMaze() {
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 50; j++) {
            let luck = getRandomInt(1, 3);
            if (luck % 2 == 1) {
                Grid[i][j].classList.remove('wall');
                animal(i, j, 3);
            }
        }
    }
}

function Maze() {
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 50; j++) {
            if (Grid[i][j].classList.contains("start") || Grid[i][j].classList.contains("des")) {
                continue;
            }
            const cell = Grid[i][j];
            cell.classList.add('wall');
        }
    }
    CreateMaze();
}

function clc() {
    for (let i = 0; i < 17; i++) {
        for (let j = 0; j < 50; j++) {
            Grid[i][j].classList.remove('visited');
            Grid[i][j].classList.remove('visited-first');
            Grid[i][j].classList.remove('shortest-path');
            vis[i][j] = 0;
        }
    }
}

Grid[startnode[0]][startnode[1]].classList.add("start");
Grid[desnode[0]][desnode[1]].classList.add("des");


///// GRAVITY FALLING
let Gravity = null;
function movenodedown() {
    let [row, col] = cur;
    row++;
    [row, col] = chk(row, col);
    if (Grid[row][col].classList.contains("wall")) {
        clearInterval(Gravity);
        Gravity = null;
        return;
    }
    if (Grid[row][col].classList.contains("worm") || Grid[row][col].classList.contains("dragon") || Grid[row][col].classList.contains("spider")) {
        showgameoverbox();
        return;
    }
    if (row == desnode[0] && col == desnode[1]) {
        showwinbox();
        return;
    }
    Grid[cur[0]][cur[1]].classList.remove("start");
    Grid[row][col].classList.add("start");
    cur = [row, col];
    startnode = cur;
}



function checkbelow() {
    if (Gravity)
        return;
    let [row, col] = cur;
    [row, col] = chk(row + 1, col);
    if (Grid[row][col].classList.contains("wall")) {
        return;
    }
    else {
        Gravity = setInterval(movenodedown, 100);
    }
}
function start() {
    setInterval(checkbelow, 200);
    Maze();
}

//Game over

const gameOverBox = document.createElement("div");
gameOverBox.id = "game-over-box";
gameOverBox.innerHTML = `
    <p>Game Over</p>
    <button id="restart-btn">Restart</button>
    <button id="quit-btn">Quit</button>
    `;
document.body.appendChild(gameOverBox);
document.getElementById("restart-btn").addEventListener("click", restartgame);
document.getElementById("quit-btn").addEventListener("click", quitgame);

function showgameoverbox() {
    console.log(1000);
    document.getElementById("game-over-box").style.display = "block";
}

async function restartgame() {
    console.log("Restarting game..");
    window.location.href = "bounce.html";
}
function quitgame() {
    window.location.href = "../category.html";
}

//win

const winBox = document.createElement("div");
winBox.id = "win-box";
winBox.innerHTML = `
<p>Congratulations!!</p>
<button id="restart-btn1">Restart</button>
<button id="quit-btn1">Quit</button>
`;
document.body.appendChild(winBox);

function showwinbox() {
    console.log(100);
    document.getElementById("win-box").style.display = "block";
}
document.getElementById("restart-btn1").addEventListener("click", restartgame);
document.getElementById("quit-btn1").addEventListener("click", quitgame);


