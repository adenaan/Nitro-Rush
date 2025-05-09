

const canvas = document.getElementById('gameCanvas');

// Tilt control


function moveLeft() {
  const currentLaneIndex = lanes.findIndex(l => l === car.x);
  const newLaneIndex = Math.max(0, currentLaneIndex - 1);
  car.x = lanes[newLaneIndex];
}

function moveRight() {
  const currentLaneIndex = lanes.findIndex(l => l === car.x);
  const newLaneIndex = Math.min(lanes.length - 1, currentLaneIndex + 1);
  car.x = lanes[newLaneIndex];
}

const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const car = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 120,
  width: 50,
  height: 100,
  color: 'red',
  speed: 6,
  boosted: false
};

const lanes = [canvas.width / 4 - 25, canvas.width / 2 - 25, (canvas.width * 3 / 4) - 25];

let obstacles = [];
let powerUps = [];
let score = 0;
let gameOver = false;

const boostBtn = document.getElementById('boostBtn');
const boostSound = document.getElementById('boostSound');

boostBtn.addEventListener('click', () => {
  if (!car.boosted) {
    car.speed *= 2;
    car.boosted = true;
    boostSound.play();
    setTimeout(() => {
      car.speed /= 2;
      car.boosted = false;
    }, 3000);
  }
});


const carImg = new Image();
carImg.src = 'car.png';
function drawCar() {
  ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
}


function drawObstacles() {
  
const obsImg = new Image();
obsImg.src = 'obstacle.png';

  obstacles.forEach(obs => {
    ctx.drawImage(obsImg, obs.x, obs.y, obs.width, obs.height);
    obs.y += obs.speed;
  });
  obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function drawPowerUps() {
  ctx.fillStyle = 'cyan';
  powerUps.forEach(pu => {
    ctx.beginPath();
    ctx.arc(pu.x + 25, pu.y + 25, 20, 0, Math.PI * 2);
    ctx.fill();
    pu.y += pu.speed;
  });
  powerUps = powerUps.filter(pu => {
    const collected = car.x < pu.x + 50 && car.x + car.width > pu.x &&
                      car.y < pu.y + 50 && car.y + car.height > pu.y;
    if (collected) score += 500;
    return pu.y < canvas.height && !collected;
  });
}

function spawnObstacle() {
  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  obstacles.push({ x: lane, y: -100, width: 50, height: 100, speed: 5 });
}

function spawnPowerUp() {
  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  powerUps.push({ x: lane, y: -100, width: 50, height: 50, speed: 3 });
}

function checkCollision() {
  obstacles.forEach(obs => {
    if (
      car.x < obs.x + obs.width &&
      car.x + car.width > obs.x &&
      car.y < obs.y + obs.height &&
      car.y + car.height > obs.y
    ) {
      gameOver = true;
    }
  });
}

function updateGame() {
  if (gameOver) {
  showGameOver();
    ctx.fillStyle = 'white';
    ctx.font = '36px sans-serif';
    ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
    ctx.fillText("Score: " + score, canvas.width / 2 - 70, canvas.height / 2 + 50);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCar();
  drawObstacles();
  drawPowerUps();
  checkCollision();

  score++;
  ctx.fillStyle = 'white';
  ctx.font = '20px sans-serif';
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(updateGame);
}



setInterval(spawnObstacle, 1000);
setInterval(spawnPowerUp, 5000);
updateGame();

const restartBtn = document.getElementById('restartBtn');

function showGameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '36px sans-serif';
  ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
  ctx.fillText("Score: " + score, canvas.width / 2 - 70, canvas.height / 2 + 50);
  restartBtn.style.display = 'block';
}

restartBtn.addEventListener('click', () => {
  obstacles = [];
  powerUps = [];
  score = 0;
  gameOver = false;
  car.x = canvas.width / 2 - 25;
  restartBtn.style.display = 'none';
  updateGame();
});


canvas.addEventListener("touchstart", function(e) {
  const touchX = e.touches[0].clientX;
  const middle = canvas.width / 2;

  const currentLaneIndex = lanes.findIndex(l => l === car.x);
  let newLaneIndex = currentLaneIndex;

  if (touchX < middle) {
    newLaneIndex = Math.max(0, currentLaneIndex - 1); // Tap left
  } else {
    newLaneIndex = Math.min(lanes.length - 1, currentLaneIndex + 1); // Tap right
  }

  car.x = lanes[newLaneIndex];
});