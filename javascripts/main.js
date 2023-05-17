const ballWH = 48;
const MoveState = { LEFT : 0, RIGHT : 1, NONE : 2};

class Ball {
    constructor(X,Y){
        this.X = X;
        this.Y = Y;
        this.deltaX = 2;
        this.deltaY = 2;
        this.img = new Image(ballWH,ballWH);
    }

    draw(context) {
        this.img.src = "./images/balle.png";
        this.img.addEventListener('load', context.drawImage(this.img, this.X, this.Y));  
    }

    move(canvas) {
        if ((this.X > canvas.width-ballWH) || (this.X < 0)) {
            this.deltaX = -(this.deltaX);
        }
        if ((this.Y > canvas.height-ballWH) || (this.Y < 0)) {
            this.deltaY = -(this.deltaY);
        }
        this.X = this.X + this.deltaX;
        this.Y = this.Y + this.deltaY;
    }

    collisionWith(obstacle) {
        const P1 = {
            x: Math.max(this.X, obstacle.x),
            y: Math.max(this.Y, obstacle.y)}
        const P2 = {
            x: Math.min(this.X + ballWH, obstacle.x + obstacle.width ), 
            y: Math.min(this.Y + ballWH, obstacle.y + obstacle.heigth)}
        if(P1.x < P2.x && P1.y < P2.y){
            return true;
        } else {
            return false;
        }
    }
}

class Animation {
    constructor(myCanvas){
        this.canvas = myCanvas;
        this.balls = new Array(new Ball(20,20));
        this.raf = null;
    }

    moveAndDraw = () => {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.balls.forEach(ball => {
            ball.move(this.canvas);$
            ball.draw(this.canvas.getContext("2d"));
        });
        this.raf = window.requestAnimationFrame(this.moveAndDraw);
    }

    start() {
        this.raf = window.requestAnimationFrame(this.moveAndDraw);
    }

    stop() {
        window.cancelAnimationFrame(this.raf);
    }

}

class Obstacle {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 50;
        this.heigth = 50;
    }

    draw(context) {
        context.fillStyle = "black";
        context.fillRect(this.x, this.y, this.width, this.heigth);
    }

    moveLeft() {
        this.shiftX = - 10;
        this.moving = MoveState.LEFT;
    }
    moveRight() {
        this.shiftX = + 10;
        this.moving = MoveState.RIGHT;
    }
    move(box) {              // déplace sans sortir des limites de *box*
        if (this.moving === MoveState.LEFT) {
          this.x = Math.max(0, this.x + this.shiftX);
        }
        if (this.moving === MoveState.RIGHT) {
          this.x = Math.min(box.width - this.width, this.x + this.shiftX);
        }
    }

    stopMoving() {
        this.moving = MoveState.NONE;
    }

}

class AnimationWithObstacle extends Animation{
    constructor(myCanvas, obstacle){
        super(myCanvas);
        this.obstacle = obstacle;
    }

    moveAndDraw = () => {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        obstacle.draw(this.canvas.getContext("2d"));
        obstacle.move(this.canvas);
        this.balls.forEach(ball1 => {
            ball1.move(this.canvas);
        });
        this.balls.forEach(ball2 => {
            if (ball2.collisionWith(this.obstacle)) {
                this.balls = this.balls.filter(ball => ball !== ball2);
            }
        });
        this.balls.forEach(ball3 => {
            ball3.draw(this.canvas.getContext("2d"));
        });
        this.raf = window.requestAnimationFrame(this.moveAndDraw);
    }

    keyDownActionHandler(event) {
        switch (event.key) {
              case "ArrowLeft":
              case "Left":
                  this.obstacle.moveLeft(); 
                  break;
              case "ArrowRight":
              case "Right":
                  this.obstacle.moveRight();
                  break;
              default: return;
          }
          event.preventDefault();
    }

    keyUpActionHandler(event) {
        switch (event.key) {
            case "ArrowLeft":
            case "Left":
            case "ArrowRight":
            case "Right":
                this.obstacle.stopMoving();
                break;
            default: return;
        }
        event.preventDefault();
    }
}

const stopAndStartButtonId = document.getElementById("stopStartBall");
const terrainID = document.getElementById("terrain");
const obstacle = new Obstacle(375,175);
obstacle.draw(terrainID.getContext("2d"));
const anime = new AnimationWithObstacle(terrainID, obstacle);
let startStop = 0;

// start
const setupAnime = () => {
    if (startStop % 2 == 0) {
        stopAndStartButtonId.textContent = "Stop";
        anime.start();
    } else {
        stopAndStartButtonId.textContent = "Start";
        anime.stop();
    }
    startStop = startStop + 1;
}
if (stopAndStartButtonId) {
    stopAndStartButtonId.addEventListener('click', setupAnime);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const addBallId = document.getElementById("addBall");
const addBalls = () => {
    anime.balls.push(new Ball(getRandomInt(terrainID.width),getRandomInt(terrainID.height)));
}
if (addBallId) {
    addBallId.addEventListener('click', addBalls);
}

window.addEventListener('keydown', anime.keyDownActionHandler.bind(anime));
window.addEventListener('keyup', anime.keyUpActionHandler.bind(anime));