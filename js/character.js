const animeDelay = 4; // delay entre chaque changement d'animation depend de nombre itération de fonction
let animeCount = 0;

const characterZoom = 10;
let shootAnimeId = 0;

class Character {
	constructor (x, y, width, height, img) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
		this.speed = 0;
		this.state = 0;
		this.animeId = 0;
		this.dir = "right";
	}

	/* Definis la vitesse de deplacement de l'obj courant */
	setSpeed = (speed) => {
		this.speed = speed;
	};

	/* Affiche l'obj courant */
	affiche = () => {
		/* afichage des balles et update */
		bullets.forEach(bullet => { bullet.afficheBullet(); bullet.moveBullet(); });
		/* suppression des balles inutile */
		bullets = bullets.filter(b => !(b.x < 0 || b.y < 0 || b.x > cnv.width));

		/* Quelle direction regard le charactére (gauche ou droit) en fonction de l'appui de clavier */
		if (etatCle[37] || etatCle[65]) this.dir = "left";
		if (etatCle[39] || etatCle[68]) this.dir = "right";
		/* changement de direction s'il y a un movement de souris et le position (gauche ou driot) par rapport à charactére 
			 priorité pour le souris que clavier */
		if(shootFrame && this.x - mousePos.x < 0) this.dir = "right";
		if(shootFrame && this.x - mousePos.x >= 0) this.dir = "left";
		/* Set characére sprite hauteur et largeur */
		this.width = mapSpritesheet.get("character_jump_bottom_"+this.dir)[this.animeId].width + characterZoom;
		this.height= mapSpritesheet.get("character_jump_bottom_"+this.dir)[this.animeId].height + characterZoom;
		/* Draw sprite bas du charactére qui saute (6 image) */
		ctx.drawImage(mapSpritesheet.get("character_jump_bottom_"+this.dir)[this.animeId], this.x, this.y, this.width, this.height);
		let xVec = Math.abs(this.x - mousePos.x);
		let yVec = Math.abs(this.y - mousePos.y);
		/* Si y a un movement de souris &&
			 position de souris est en haut de position de charactére &&
			 position de souris est dans le 2éme octant ou 3éme octant */
		if(shootFrame && this.y - mousePos.y > 0 && yVec > xVec){
			/* Draw un point(petit cercle) ver la position de souris */
			ctx.beginPath();
			ctx.arc(mousePos.x, mousePos.y, 3, 0, Math.PI * 2, true);
			ctx.fill();

			/*
			// line droite de la position de pistolet ver la position de souries
			ctx.beginPath();
			ctx.moveTo(mousePos.x, mousePos.y);
			ctx.lineTo(this.x + this.width/2, this.y-this.height/2);
			ctx.stroke();
			*/

			if(mouseClicked){
				bullets.push(new Bullet(this.x+ this.width/2, this.y-this.height/2, mousePos.x, mousePos.y));
			}

			/* Si le souris est dans le 2éme octant */
			if(this.x - mousePos.x < 0){
				/* shootAnimeId => 4 à 7 psk on a 4 sprite pour le 2éme octant */
				shootAnimeId = Math.floor(Math.abs((xVec)/((yVec)/4)+4));
			}else{ 	/* Si le souris est dans le 3éme octant */
				/* shootAnimeId => 0 à 3 psk on a 4 sprite pour le 3éme octant */
				shootAnimeId = Math.floor(Math.abs((xVec)/((yVec)/4)-4));
			}
			/* Draw le haut de characére qui avec le pistoler (8 image <=> 0 à 7) */
			ctx.drawImage(mapSpritesheet.get("character_shoot_top")[shootAnimeId], this.x-4, this.y-this.height, this.width+4, this.height+4);
		}else{ /* Draw le haut de characére qui saute (6 image) */
			ctx.drawImage(mapSpritesheet.get("character_jump_top_"+this.dir)[this.animeId], this.x-4, this.y-this.height, this.width+4, this.height+4);
		}
		if(shootFrame>0)shootFrame--;
		mouseClicked = false;
	};

	/* Definis la position de l'obj courant */
	setPos = (nx, ny) => {
		this.x = nx;
		this.y = ny;
	};

	/* Si le personnage sort de l'écran par la droite, il revient par la gauche [vice versa] */
	managePos = () => {
		if (this.x < -this.width/2) this.setPos(cnv.width-this.width,this.y);
		if (this.x >= cnv.width) this.setPos(0, this.y);
	};

	/* Gere les changement de position pendant */
	setPosFall = () => {
		let dir = this.speed >= 0 ? -1 : 1;
		for (let i = this.speed; i != 0; i+=1*dir) {
			this.setPos(this.x , this.y + 1*dir);
			if (this.speed <= 0){
				if (collisionPlatform(this)){
					this.animeId = 0;
					break;
				}
			}
		}
		if(animeCount == animeDelay) animeCount=0;
		if(!(animeCount%animeDelay)){
			this.animeId++;
			if(this.animeId >  mapSpritesheet.get("character_jump_top_right").length-1) this.animeId = mapSpritesheet.get("character_jump_top_right").length-1;
		}
		this.setPos(this.x + mouvement, this.y);
		animeCount +=1;
	};

	/* Gere l'animation et l'affichage de l'obj */
	jump = () => {
		this.setPosFall();
		this.managePos();
		mouvement = 0;
		if (this.speed != MAX_SPEED*-1) {
			/* Limite la vitesse de la chute au negatif de la vitesse de chute maximal */
			this.speed -= APESANTEUR; 
		}
		this.affiche();
	};
}