const gridcontainer = document.querySelector('.grid-container');

const startnode = [6, 3];
const desnode = [12, 37];
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


let vis = [];
let Parent = new Map();

// Initialize Grid and vis arrays
for (let i = 0; i < 17; i++) {
    vis[i] = [];
    for (let j = 0; j < 50; j++) {
        vis[i][j] = 0;
    }
}

const r = [0, 1, 0, -1];
const c = [1, 0, -1, 0];


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startdfs(p0, p1) {

    vis[p0][p1] = 1;
    if(p0==desnode[0] && p1==desnode[1])
    {
        path();
        exit();
    }

    for (let i = 0; i < 4; i++) {
        let x = p0 + r[i];
        let y = p1 + c[i];

        if (x < 0 || y < 0 || x === 17 || y === 50 || vis[x][y] === 1) {
            continue;
        }
        const cell = Grid[x][y];
        if (cell.classList.contains('wall')) {
            continue;
        }
        if (x !== desnode[0] || y !== desnode[1]) {
            Grid[x][y].classList.add('visited-first');
        }
        Parent.set(`${x},${y}`, `${p0},${p1}`);
        await new Promise(resolve => setTimeout(resolve, 50));
        Grid[x][y].classList.add('visited');
        await startdfs(x, y);
    }
}


async function path() {
    let current = desnode;
    while (current[0] !== startnode[0] || current[1] !== startnode[1]) {
        const [x, y] = current;
        Grid[x][y].classList.add('shortest-path');
        const parentKey = Parent.get(`${x},${y}`);
        const [p0, p1] = parentKey.split(',').map(Number);
        current = [p0, p1];
        await sleep(30);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  

function Dfs()
  {
      for(let i=0;i<17;i++)
      {
          for(let j=0;j<50;j++)
          {
            let luck=getRandomInt(1, 3);
            if(luck%2==1)
                Grid[i][j].classList.remove('wall');
        }
    }
}

function Maze(){
    for(let i=0;i<17;i++)
    {
        for(let j=0;j<50;j++)
        {
            if( Grid[i][j].classList.contains("start") || Grid[i][j].classList.contains("des") )
            {
                continue;
            }
            const cell = Grid[i][j];
            cell.classList.toggle('wall');
        }
    }
   Dfs();
}

function clc()
{
    for(let i=0;i<17;i++)
    {
        for(let j=0;j<50;j++)
        {
            Grid[i][j].classList.remove('visited');
            Grid[i][j].classList.remove('visited-first');
            Grid[i][j].classList.remove('shortest-path');
            vis[i][j]=0;
        }
    }
}

Grid[startnode[0]][startnode[1]].className = 'start';
Grid[desnode[0]][desnode[1]].className = 'des';

function dfs() {
    startdfs(startnode[0], startnode[1]);
}
