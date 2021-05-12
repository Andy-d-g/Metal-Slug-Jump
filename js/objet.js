const direction = [-1,1];

/* Structure d'un objet */
class Objet {
	constructor (x, y, width, height, type, img, dir) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.img = img;
		this.dir = dir;
		this.state = 0;
		this.animeId = 0;
	};

	/* Affiche l'element courant dans le canvas */
	affiche = () => {
		try {
			ctx.drawImage(this.img, this.x, this.y);
		}
		catch (err) {
			//console.log(err);
		}
	};

	/* Renvoi 1 si l'obj est dans l'intervalle de la largeur de l'element courant */
	isInInterval_X = (obj_x_min, obj_x_max) => {
		let obj_x = [obj_x_min, obj_x_max];
		for (let i = 0; i < 2; i++) {
			if (obj_x[i] >= this.x && obj_x[i] <= this.x + this.width){
				return 1;
			}
		}
		return 0;
	};

	/* Renvoi 1 si l'obj est dans l'intervalle de la hauteur de l'element courant */
	isInInterval_Y = (obj_y) => {
		if (obj_y >= this.y && obj_y <= this.y + this.height){
			return 1;
		}
		return 0;
	};

	/* Renvoi 1 si il y a une collision avec l'element courant */
	isInCollision = (obj) => {
		/* On verifie la largeur */
		if (this.isInInterval_X(obj.x,obj.x+obj.width)) {
			/* On verifie la hauteur */ 
			if (this.isInInterval_Y(obj.y+obj.height)) {
				return 1;
			}
		}
		return 0;
	};
}

/* Met a jour les positions des obj du tableau en hauteur */
const updatePosHigh = (speed,array) => {
	/* Change la hauteur des platforme */
	for (let obj of array) {
		obj.y += speed;
	}
	/* Supprime les platforme qui depasse du canvas */
	for (let i = 0; i < array.length; i++){
		if (array[i].y >= cnv.height) {
			array.splice(i,1);
		}
	}
}