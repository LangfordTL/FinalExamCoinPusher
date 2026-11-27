const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startLine = 190;
const dropLine = 625;
const gravity = 3;
const coinImages = [
    "img/pokerchips/Black Chip.png",
    "img/pokerchips/Blue Chip.png",
    "img/pokerchips/Green Chip.png",
    "img/pokerchips/Red Chip.png",
];
const coinValues = {
    "img/pokerchips/Black Chip.png": 1,
    "img/pokerchips/Blue Chip.png": 5,
    "img/pokerchips/Green Chip.png": 10,
    "img/pokerchips/Red Chip.png": 25,
};

let spawnCounter = 0;
let score = 0;
let coins = [];
let value = [

]
// Pusher settings
let pusher = {
    x: 0,
    y: 0,
    width: 800,
    height: 130,
    speed: 1.5,
    direction: 1,
    isMovingForward: true
};
// Dropper settings 
let dropper = {
    x: 0,
    y: 625,
    width: 800,
    height: 75,
}

function drawGame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pusher
    ctx.fillStyle = 'black';
    ctx.fillRect(
        pusher.x,
        pusher.y,
        pusher.width,
        pusher.height
    );

    //draws the dropper
    ctx.fillStyle = 'black';
    ctx.fillRect(
        dropper.x,
        dropper.y,
        dropper.width,
        dropper.height
    );

    // Draw red starting line
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(-20, startLine);
    ctx.lineTo(900, startLine);
    ctx.stroke();

    // Draw gray drop line
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-20, dropLine);
    ctx.lineTo(900, dropLine);
    ctx.stroke();
}

function pusherAnimation() {

    pusher.y += pusher.speed * pusher.direction;

    // Stop at the red line
    if (pusher.y + pusher.height >= startLine) {
        pusher.y = startLine - pusher.height;
        pusher.direction = -1;
    }

    // Return to starting position
    if (pusher.y <= 10) {
        pusher.y = 10;
        pusher.direction = 1;
    }
}

function addCoin() {
    const ci = new Image();

    let randomCoin; 
    if (Math.floor(Math.random() * 1000) === 0){
        ci.src = coinImages[randomCoin];
    } else {
        randomCoin = Math.floor(Math.random() * coinImage.length);
        ci.src = coinImages[randomCoin];
    }

    const coin = {
        x: Math.random() * (canvas.width - 50),
        y: startLine,
        width: 50,
        height: 50,
        image: ci,
        speedX: 0,
        speedY: 0,
        value: coinValues[ci.src]
    };
    coins.push(coin);
}
function updateCoins() {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        const previousY = coin.y;
        coin.speedY += gravity;

        coin.x += coin.speedX;
        coin.y += coin.speedY;


        if (coin.x <= 0) {
            coin.x = 0;
            coin.speedX = 0;
        }
        if (coin.x + coin.width >= canvas.width) {
            coin.x = canvas.width - coin.width;
            coin.speedX = 0;
        }
        if (coin.y + coin.height >= dropper.y) {
            coin.y = dropper.y - coin.height;
            coin.speedY = 0;
        }
        /*if (coin.y + coin.height >= dropLine) {
            score += coin.value;
            coins.splice(i, 1);
            continue;
        }
       if (coin.y + coin.height >= dropper.y){
        coin.y = dropper.y - coin.height;
        coin.speedY = 0;
       }*/


    

    for (let j = 0; j < coins.length; j++) {
        if (i !== j) {
            const coinA = coins[j];
            const hOverlap =
                coin.x < coinA.x + coinA.width &&
                coin.x + coin.width > coinA.x;

            const landedOnCoin =
                previousY + coin.height <= coinA.y &&
                coin.y + coin.height >= coinA.y;

            if (hOverlap && landedOnCoin && coin.speedY > 0) {
                coin.y = coinA.y - coin.height;
                coin.speedY = 0;
            }

        }
    }
}

}


function drawCoins() {
    for (const coin of coins) {
        ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
    }
}

function spawnCoin() {
    spawnCounter++;
    if (spawnCounter >= 5 && coins.length < 90) {
        addCoin();
        spawnCounter = 0;
    }
}

document.getElementById("coinButton").addEventListener('click', function() {
    //addCoin();
    coins[coins.length - 1].x = canvas.width / 2 - 25;
    coins[coins.length - 1].y = startLine / 2;
});

function collisonDetection() {
    for (const coin of coins) {
        if (
            pusher.direction === 1 &&
            coin.x < pusher.x + pusher.width &&
            coin.x + coin.width > pusher.x &&
            coin.y < pusher.y + pusher.height &&
            coin.y + coin.height > pusher.y
        ) {
            // Collision detected, move the coin with the pusher
            coin.y = pusher.y + pusher.height;
            coin.speedY = 0;
        }
    }
}

function gameLoop() {
    pusherAnimation();
    spawnCoin();
    updateCoins();
    drawGame();
    drawCoins();
    collisonDetection();
    requestAnimationFrame(gameLoop);
}
for (let i = 0; i < 20; i++) {
    addCoin();
    //coins[i].x = 20 + (i * 70);
}
gameLoop();


