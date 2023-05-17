export default class Ball {
    constructor(X,Y,deltaX,deltaY){
        this.X = X;
        this.Y = Y;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.img = new Image("../images/balle.png");
    }

    draw(context) {
        context.drawImage(this.img, this.X,this.Y);
    }

    move(canvas) {
        if(this.X == 0 || this.Y == 0 || this.X == canvas.width || this.Y == canvas.height){
            this.deltaY = -this.deltaY;
            this.deltaX = -this.deltaX;
        }
        this.X + this.deltaX;
        this.Y + this.deltaY;
    }
}