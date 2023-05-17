export default class Animation {
    constructor(canvas){
        this.canvas = canvas;
        this.ball = new Ball(10,10,2,2);
        this.raf = null;
    }

    moveAndDraw(context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.ball.move(context);
        this.ball.draw(context);
        this.raf = window.requestAnimationFrame(moveAndDraw);
    }
    
    stop() {
        window.cancelAnimationFrame(this.raf);
    }

    start() {
        this.raf = window.requestAnimationFrame(moveAndDraw);
    }
}