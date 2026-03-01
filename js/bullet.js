const bulletSpeed = 15;
let bullets = [];


class Bullet {
	constructor (x1, y1, x2, y2) {
		this.x = 0;
		this.y = 0;
		this.width = 5;
		this.height = 5;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.pente = x2 - x1;
		this.slope = (x2 - x1)/(y2 - y1);
    this.move = 10;
    this.size = 5;
	}
	moveBullet = () => {
		this.move += bulletSpeed;
	}

	afficheBullet = () => {
		if(this.pente > 0){
			this.x = this.x1 - (this.move*this.slope);
			this.y = this.y1 - this.move;
		}else{
			this.x = this.x1 - (this.move*this.slope);
			this.y = this.y1 - this.move;
		}
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size-1, 0, Math.PI * 2, true);
		ctx.fillStyle = 'orange';
		ctx.fill();
		ctx.beginPath();
		ctx.arc(this.x+1, this.y-1, this.size-3, 0, Math.PI * 2, true);
		ctx.fillStyle = 'yellow';
		ctx.fill();
		ctx.fillStyle = 'black';
	}
}