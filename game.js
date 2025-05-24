// Константы игры
const TILE_SIZE = 16;
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.5;
const SCATTER_TIME = 7000;
const CHASE_TIME = 20000;

// Игровые переменные
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let score = 0;
let lives = 3;
let gameRunning = false;
let gameOver = false;

// Лабиринт (1 - стена, 0 - путь, 2 - точка, 3 - энерджайзер, 4 - фрукт)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Пакман
const pacman = {
    x: 14 * TILE_SIZE,
    y: 23 * TILE_SIZE,
    radius: TILE_SIZE / 2,
    speed: PACMAN_SPEED,
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    mouthAngle: 0,
    mouthOpen: true,
    mouthSpeed: 0.1
};

// Привидения
const ghosts = [
    { // Красное привидение (Блинки)
        x: 14 * TILE_SIZE,
        y: 11 * TILE_SIZE,
        radius: TILE_SIZE / 2,
        speed: GHOST_SPEED,
        direction: { x: -1, y: 0 },
        color: '#FF0000',
        scared: false,
        mode: 'scatter',
        modeTimer: SCATTER_TIME,
        target: { x: 0, y: 0 }
    },
    { // Розовое привидение (Пинки)
        x: 14 * TILE_SIZE,
        y: 14 * TILE_SIZE,
        radius: TILE_SIZE / 2,
        speed: GHOST_SPEED,
        direction: { x: 1, y: 0 },
        color: '#FFB8FF',
        scared: false,
        mode: 'scatter',
        modeTimer: SCATTER_TIME,
        target: { x: 0, y: 0 }
    },
    { // Голубое привидение (Инки)
        x: 12 * TILE_SIZE,
        y: 14 * TILE_SIZE,
        radius: TILE_SIZE / 2,
        speed: GHOST_SPEED,
        direction: { x: -1, y: 0 },
        color: '#00FFFF',
        scared: false,
        mode: 'scatter',
        modeTimer: SCATTER_TIME,
        target: { x: 0, y: 0 }
    },
    { // Оранжевое привидение (Клайд)
        x: 16 * TILE_SIZE,
        y: 14 * TILE_SIZE,
        radius: TILE_SIZE / 2,
        speed: GHOST_SPEED,
        direction: { x: 1, y: 0 },
        color: '#FFB852',
        scared: false,
        mode: 'scatter',
        modeTimer: SCATTER_TIME,
        target: { x: 0, y: 0 }
    }
];

// Клавиши управления
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Инициализация игры
function init() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            keys[e.key] = true;
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            keys[e.key] = false;
            e.preventDefault();
        }
    });
}

// Начало игры
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    gameRunning = true;
    gameOver = false;
    score = 0;
    lives = 3;
    updateScore();
    updateLives();
    resetPositions();
    gameLoop();
}

// Рестарт игры
function restartGame() {
    document.getElementById('game-over-screen').style.display = 'none';
    startGame();
}

// Сброс позиций
function resetPositions() {
    pacman.x = 14 * TILE_SIZE;
    pacman.y = 23 * TILE_SIZE;
    pacman.direction = { x: 0, y: 0 };
    pacman.nextDirection = { x: 0, y: 0 };
    
    ghosts[0].x = 14 * TILE_SIZE;
    ghosts[0].y = 11 * TILE_SIZE;
    ghosts[0].direction = { x: -1, y: 0 };
    
    ghosts[1].x = 14 * TILE_SIZE;
    ghosts[1].y = 14 * TILE_SIZE;
    ghosts[1].direction = { x: 1, y: 0 };
    
    ghosts[2].x = 12 * TILE_SIZE;
    ghosts[2].y = 14 * TILE_SIZE;
    ghosts[2].direction = { x: -1, y: 0 };
    
    ghosts[3].x = 16 * TILE_SIZE;
    ghosts[3].y = 14 * TILE_SIZE;
    ghosts[3].direction = { x: 1, y: 0 };
    
    ghosts.forEach(ghost => {
        ghost.scared = false;
        ghost.mode = 'scatter';
        ghost.modeTimer = SCATTER_TIME;
    });
}

// Игровой цикл
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    
    if (gameOver) {
        endGame();
        return;
    }
    
    requestAnimationFrame(gameLoop);
}

// Обновление игры
function update() {
    // Обновление Пакмана
    updatePacman();
    
    // Обновление привидений
    ghosts.forEach(ghost => updateGhost(ghost));
    
    // Проверка столкновений
    checkCollisions();
    
    // Проверка завершения игры
    if (checkWin()) {
        gameOver = true;
    }
}

// Обновление Пакмана
function updatePacman() {
    // Обработка ввода
    if (keys.ArrowUp) pacman.nextDirection = { x: 0, y: -1 };
    if (keys.ArrowDown) pacman.nextDirection = { x: 0, y: 1 };
    if (keys.ArrowLeft) pacman.nextDirection = { x: -1, y: 0 };
    if (keys.ArrowRight) pacman.nextDirection = { x: 1, y: 0 };
    
    // Проверка возможности движения в выбранном направлении
    const nextX = Math.floor((pacman.x + pacman.nextDirection.x * pacman.speed) / TILE_SIZE);
    const nextY = Math.floor((pacman.y + pacman.nextDirection.y * pacman.speed) / TILE_SIZE);
    
    if (maze[nextY] && maze[nextY][nextX] !== 1) {
        pacman.direction = { ...pacman.nextDirection };
    }
    
    // Проверка возможности движения в текущем направлении
    const moveX = Math.floor((pacman.x + pacman.direction.x * pacman.speed) / TILE_SIZE);
    const moveY = Math.floor((pacman.y + pacman.direction.y * pacman.speed) / TILE_SIZE);
    
    if (maze[moveY] && maze[moveY][moveX] !== 1) {
        pacman.x += pacman.direction.x * pacman.speed;
        pacman.y += pacman.direction.y * pacman.speed;
    }
    
    // Телепортация через туннели
    if (pacman.x < 0) pacman.x = canvas.width;
    if (pacman.x > canvas.width) pacman.x = 0;
    
    // Анимация рта
    pacman.mouthAngle += pacman.mouthSpeed;
    if (pacman.mouthAngle > 0.3 || pacman.mouthAngle < 0) {
        pacman.mouthSpeed = -pacman.mouthSpeed;
        pacman.mouthOpen = !pacman.mouthOpen;
    }
    
    // Сбор точек
    const tileX = Math.floor(pacman.x / TILE_SIZE);
    const tileY = Math.floor(pacman.y / TILE_SIZE);
    
    if (maze[tileY][tileX] === 2) {
        maze[tileY][tileX] = 0;
        score += 10;
        updateScore();
    } else if (maze[tileY][tileX] === 3) {
        maze[tileY][tileX] = 0;
        score += 50;
        updateScore();
        ghosts.forEach(ghost => ghost.scared = true);
        setTimeout(() => {
            ghosts.forEach(ghost => ghost.scared = false);
        }, 5000);
    } else if (maze[tileY][tileX] === 4) {
        maze[tileY][tileX] = 0;
        score += 100;
        updateScore();
    }
}

// Обновление привидений
function updateGhost(ghost) {
    // Смена режима
    ghost.modeTimer -= 16;
    if (ghost.modeTimer <= 0) {
        if (ghost.mode === 'scatter') {
            ghost.mode = 'chase';
            ghost.modeTimer = CHASE_TIME;
        } else {
            ghost.mode = 'scatter';
            ghost.modeTimer = SCATTER_TIME;
        }
    }
    
    // Определение цели
    if (ghost.mode === 'scatter') {
        // В режиме scatter привидения идут в свои углы
        if (ghost.color === '#FF0000') ghost.target = { x: 26 * TILE_SIZE, y: 0 };
        else if (ghost.color === '#FFB8FF') ghost.target = { x: 0, y: 0 };
        else if (ghost.color === '#00FFFF') ghost.target = { x: 26 * TILE_SIZE, y: 30 * TILE_SIZE };
        else ghost.target = { x: 0, y: 30 * TILE_SIZE };
    } else {
        // В режиме chase разные привидения имеют разные стратегии погони
        if (ghost.color === '#FF0000') { // Блинки преследует напрямую
            ghost.target = { x: pacman.x, y: pacman.y };
        } else if (ghost.color === '#FFB8FF') { // Пинки стремится в точку перед Пакманом
            ghost.target = {
                x: pacman.x + pacman.direction.x * 4 * TILE_SIZE,
                y: pacman.y + pacman.direction.y * 4 * TILE_SIZE
            };
        } else if (ghost.color === '#00FFFF') { // Инки использует сложную стратегию
            const redGhost = ghosts.find(g => g.color === '#FF0000');
            const vector = {
                x: pacman.x - redGhost.x,
                y: pacman.y - redGhost.y
            };
            ghost.target = {
                x: pacman.x + vector.x,
                y: pacman.y + vector.y
            };
        } else { // Клайд иногда преследует, иногда бродит
            const dist = Math.sqrt(
                Math.pow(ghost.x - pacman.x, 2) + 
                Math.pow(ghost.y - pacman.y, 2)
            );
            if (dist > 8 * TILE_SIZE) {
                ghost.target = { x: pacman.x, y: pacman.y };
            } else {
                ghost.target = { x: 0, y: 30 * TILE_SIZE };
            }
        }
    }
    
    // Если привидение испугано, оно убегает
    if (ghost.scared) {
        ghost.target = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
    }
    
    // Поиск пути к цели
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];
    
    // Исключаем обратное направление
    const validDirections = directions.filter(dir => 
        !(dir.x === -ghost.direction.x && dir.y === -ghost.direction.y)
    );
    
    // Выбираем направление, которое ближе к цели
    let bestDirection = ghost.direction;
    let minDistance = Infinity;
    
    for (const dir of validDirections) {
        const nextX = Math.floor((ghost.x + dir.x * ghost.speed) / TILE_SIZE);
        const nextY = Math.floor((ghost.y + dir.y * ghost.speed) / TILE_SIZE);
        
        if (maze[nextY] && maze[nextY][nextX] !== 1) {
            const distance = Math.sqrt(
                Math.pow(ghost.target.x - (ghost.x + dir.x * ghost.speed), 2) + 
                Math.pow(ghost.target.y - (ghost.y + dir.y * ghost.speed), 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                bestDirection = dir;
            }
        }
    }
    
    ghost.direction = bestDirection;
    
    // Движение привидения
    ghost.x += ghost.direction.x * ghost.speed;
    ghost.y += ghost.direction.y * ghost.speed;
    
    // Телепортация через туннели
    if (ghost.x < 0) ghost.x = canvas.width;
    if (ghost.x > canvas.width) ghost.x = 0;
}

// Проверка столкновений
function checkCollisions() {
    ghosts.forEach(ghost => {
        const distance = Math.sqrt(
            Math.pow(pacman.x - ghost.x, 2) + 
            Math.pow(pacman.y - ghost.y, 2)
        );
        
        if (distance < pacman.radius + ghost.radius) {
            if (ghost.scared) {
                // Пакман съедает привидение
                ghost.scared = false;
                ghost.x = 14 * TILE_SIZE;
                ghost.y = 14 * TILE_SIZE;
                score += 200;
                updateScore();
            } else {
                // Привидение съедает Пакмана
                lives--;
                updateLives();
                
                if (lives <= 0) {
                    gameOver = true;
                } else {
                    resetPositions();
                }
            }
        }
    });
}

// Проверка победы (все точки съедены)
function checkWin() {
    for (let row of maze) {
        for (let cell of row) {
            if (cell === 2 || cell === 3) return false;
        }
    }
    return true;
}

// Отрисовка игры
function draw() {
    // Очистка canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовка лабиринта
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) { // Стены
                ctx.fillStyle = '#0000FF';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (maze[y][x] === 2) { // Точки
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(
                    x * TILE_SIZE + TILE_SIZE / 2,
                    y * TILE_SIZE + TILE_SIZE / 2,
                    2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else if (maze[y][x] === 3) { // Энерджайзеры
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(
                    x * TILE_SIZE + TILE_SIZE / 2,
                    y * TILE_SIZE + TILE_SIZE / 2,
                    5,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else if (maze[y][x] === 4) { // Фрукты
                ctx.fillStyle = '#FF0';
                ctx.beginPath();
                ctx.arc(
                    x * TILE_SIZE + TILE_SIZE / 2,
                    y * TILE_SIZE + TILE_SIZE / 2,
                    6,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
    
    // Отрисовка привидений
    ghosts.forEach(ghost => {
        if (ghost.scared) {
            ctx.fillStyle = '#0000FF'; // Синий, когда испуган
        } else {
            ctx.fillStyle = ghost.color;
        }
        
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(
            ghost.x - ghost.radius / 3,
            ghost.y - ghost.radius / 3,
            ghost.radius / 3,
            0,
            Math.PI * 2
        );
        ctx.arc(
            ghost.x + ghost.radius / 3,
            ghost.y - ghost.radius / 3,
            ghost.radius / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Зрачки
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(
            ghost.x - ghost.radius / 3 + ghost.direction.x * 2,
            ghost.y - ghost.radius / 3 + ghost.direction.y * 2,
            ghost.radius / 6,
            0,
            Math.PI * 2
        );
        ctx.arc(
            ghost.x + ghost.radius / 3 + ghost.direction.x * 2,
            ghost.y - ghost.radius / 3 + ghost.direction.y * 2,
            ghost.radius / 6,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
    
    // Отрисовка Пакмана
    ctx.fillStyle = '#FF0';
    ctx.beginPath();
    
    const startAngle = pacman.direction.x === 1 ? 0.2 * Math.PI :
                      pacman.direction.x === -1 ? 1.2 * Math.PI :
                      pacman.direction.y === 1 ? 0.7 * Math.PI :
                      1.7 * Math.PI;
    
    const endAngle = pacman.direction.x === 1 ? 1.8 * Math.PI :
                    pacman.direction.x === -1 ? 0.8 * Math.PI :
                    pacman.direction.y === 1 ? 1.3 * Math.PI :
                    0.3 * Math.PI;
    
    ctx.arc(
        pacman.x,
        pacman.y,
        pacman.radius,
        startAngle + (pacman.mouthOpen ? pacman.mouthAngle : 0),
        endAngle - (pacman.mouthOpen ? pacman.mouthAngle : 0),
        false
    );
    
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();
}

// Обновление счета
function updateScore() {
    document.getElementById('score-display').textContent = `Score: ${score}`;
}

// Обновление жизней
function updateLives() {
    document.getElementById('lives-display').textContent = `Lives: ${lives}`;
}

// Конец игры
function endGame() {
    gameRunning = false;
    document.getElementById('final-score').textContent = `Score: ${score}`;
    document.getElementById('game-over-screen').style.display = 'flex';
}

// Инициализация при загрузке
window.onload = init;