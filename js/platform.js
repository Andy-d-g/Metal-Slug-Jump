/* 
 *             -- TYPE DE PLATFORME -- 
 *
 * 0) VERT : REBOND NORMAL
 *
 * 1) BLEU : REBOND NORMAL + DEPLACEMENT HORIZONZAL
 *
 * 2) AUTRE_BLEU : ????
 *
 * 3) BLANC : REBOND + DISPARITION
 *
 * 4) MARRON : PAS DE REBOND + SE CASSE A LA COLLISION
 *
 * 5) YELLOW : REBOND NORMAL + AFFAIBLISSEMENT A CHAQUE INTERACTION
 *
 */

class Platform extends Objet{
	constructor (x,y,width,height,type,img,dir) {
		super(x,y,width,height,type,img,dir);
	}
}

/* Affiche toute les platforme */
const affichePlatform = () => { 
	for (let platform of platformArray) {
		platform.affiche();
	}
}

/* Gere les potentiel collision avec des platform*/
const collisionPlatform = (character) => {
	for (let i = 0; i < platformArray.length; i++) {
		/* Si je rentre en collision en descente */
		if (platformArray[i].isInCollision(character) && character.speed <= 0){
			/* Si c'est une platforme qui se brise */
			if (platformArray[i].type == 4) {
				/* Definis le nouvel etat :  */
				if (platformArray[i].state===1) {platformArray[i].animeId=0;}
				platformArray[i].state=1;
				return 0;
			}
			else {
				if (platformArray[i].type == 5) {
					if (platformArray[i].animeId < 4) {platformArray[i].img = mapSpritesheet.get('platform_weak')[++platformArray[i].animeId];}
					else {platformArray.splice(i,1);}
				}
				else if (platformArray[i].type == 3) {
					platformArray.splice(i,1);
				}
				/* Definis le deplacement vers le haut */
				character.setSpeed(MAX_SPEED);
				return 1;
			}
		}
	}
	return 0;
}

/* Met a jour l'affichage des platform (non hauteur) */
const updateAffichagePlatform = (speed) => {
	for (let i = 0; i < platformArray.length; i++){
		/* Si c'est une platform mouvante */
		if (platformArray[i].type==1){
			platformArray[i].x += speed * platformArray[i].dir;
			/* Si la platform sort de l'ecran : change la direction */
			if ((platformArray[i].x > cnv.width-platformArray[i].width && platformArray[i].dir === 1) || (platformArray[i].x < 0 && platformArray[i].dir === -1)) {
				platformArray[i].dir *= -1;
			}
		}

		/* Si c'est une platform qui se casse */
		else if (platformArray[i].type==4 && platformArray[i].state != 0){
			/* Si je n'ai pas atteind le dernier sprite de l'animation de la cassure de la platform : j'affiche le sprite suivant */
			if (platformArray[i].animeId < 4) {platformArray[i].img = mapSpritesheet.get('platform_break')[platformArray[i].animeId++];}
			else {platformArray.splice(i,1);}
		}
	}
}

/* Creation d'une nouvelle platform a la hauteur dx */
const createNewPlatform = (type) => {
	let dir=0;

	if (type==1 || type==2){dir = direction[getRandom(1,50)%2];}

	let img;

	if (type==4){img = mapSpritesheet.get('platform_break')[0];}
	else if (type==5){img = mapSpritesheet.get('platform_weak')[0];}
	else {img = mapSpritesheet.get('platform_base')[type];}


	let larg = LARG_PLATFORM; 
	let haut = HAUT_PLATFORM;

	let x = getRandom(0,cnv.width-larg);
	let y = platformArray[platformArray.length-1].y - getRandom(50,150);

	if (type==4){
		if (platformArray[platformArray.length-1].type==4){type=0; y = platformArray[platformArray.length-1].y - getRandom(50,150);}
		else{y = platformArray[platformArray.length-1].y - getRandom(20,50);}
	}

	platformArray.push(new Platform(x,y,larg,haut,type,img,dir));
}

/* Genere les premiere platforme du jeu */
const genStartMap = () => {
	const nbPlatformStart = 9;
	let y;

	/* Platform de depart pour poser toutes les autre */
	platformArray.push(new Platform(
		getRandom(0,cnv.width-LARG_PLATFORM),
		cnv.height-80,
		LARG_PLATFORM,
		HAUT_PLATFORM,
		0,
		mapSpritesheet.get('platform_base')[0],
		0));

	/* Genere 10 plateforme pour le debut de la partie */
	for (let i = 0; i < nbPlatformStart; i++){createNewPlatform(0);}

	return 1;
}