/* 
 *             -- TYPE DE MONSTRE -- 
 *
 * 0) Droite a gauche
 *
 * 1) ?
 *
 */

class Monster extends Objet{
	constructor (x,y,width,height,type,img,dir) {
		super(x,y,width,height,type,img,dir);
	}

	collision = (character) => {
		if ((this.isInCollision(character) || (this.isInInterval_Y(character.y) && this.isInInterval_X(character.x, character.x+character.width))) && this.state===0){return 1;}
		return 0;
	};
}

/* Affiche tout les element du tableau des monstres */
const afficheMonster = () => {
	for (let monster of monsterArray) {
		monster.affiche();
	}
}

/* Gere les potentiel collision avec des monstres*/
const collisionMonster = (character) => {
	for (let monster of monsterArray) {
		/* Si je rentre en collision avec un monstre */
		if (monster.collision(character)){return 1;}
	}
	return 0;
}

const collisionMonsterBullets = () => {
	let collideIndex = [];
	for(let i = 0; i <  monsterArray.length; i++){
		for(let j = 0; j < bullets.length; j++){
			if(monsterArray[i].isInCollision(bullets[j])){
				if (monsterArray[i].type==2 && monsterArray[i].state===0) {monsterArray[i].state=1; animeId=0; console.log("toucher");}
				else if (monsterArray[i].state===0) collideIndex.push([i, j]);
			}
		}
	}
	collideIndex.forEach(i => {
		monsterArray.splice(i[0],  1);
		bullets.splice(i[1], 1);
	});
}

/* Met a jour l'affichage des platform (non hauteur) */
const updateAffichageMonster = (speed) => {
	const space=15;
	const trajectoire = [[-space,space],[-space,space],[-space,space],[-space,0],[-space,-space],[-space,-space],[0,space],[space,space],[space,space],[space,space],[space,0],[space,space]];
	let index;
	for (let i = 0; i < monsterArray.length; i++){
		/* Si c'est un monstre mouvant */
		if (monsterArray[i].type==1){
			if (monsterArray[i].animeId>trajectoire.length-1) monsterArray[i].animeId=0;
			monsterArray[i].x += trajectoire[monsterArray[i].animeId][0];
			monsterArray[i].y += trajectoire[monsterArray[i].animeId][1];
			monsterArray[i].animeId++;
		}

		else if (monsterArray[i].type==2){
			/* Si le monstre n'as pas encore ete tuer */
			if (monsterArray[i].state===0){
				monsterArray[i].animeId++;
				if (monsterArray[i].animeId>=mapSpritesheet.get('monster2_base').length) monsterArray[i].animeId=0;
				monsterArray[i].x += speed * monsterArray[i].dir;
				/* Si le monstre sort de l'ecran : change la direction */
				if ((monsterArray[i].x > cnv.width-monsterArray[i].width && monsterArray[i].dir === 1) || (monsterArray[i].x < 0 && monsterArray[i].dir === -1)) {
					monsterArray[i].dir *= -1;
				}
				monsterArray[i].img = mapSpritesheet.get('monster2_base')[monsterArray[i].animeId];
			}
			/* Si le monstre a ete tuer */
			else {
				monsterArray[i].img = mapSpritesheet.get('monster2_die')[monsterArray[i].animeId];
				monsterArray[i].animeId++;	
				if (monsterArray[i].animeId>=mapSpritesheet.get('monster2_die').length) monsterArray.splice(i,1);
			}
		}
	}
}

/* Ajout au tableau des monstres un nouvel element en fonction du type en parametre */
const createNewMonster = (type) => {
	let dir=0;

	if (type==1 || type==2) {dir = direction[getRandom(1,50)%2];}

	let width = 50;
	let height = 50;

	let x = getRandom(0,cnv.width-width);
	let y = -200;

	let img;

	console.log(type);
	if (type==0){img = mapSpritesheet.get('hole')[0];}
	// Changer la taille du monstre 2
	else if (type==2){img = mapSpritesheet.get('monster2_base')[0];}
	else {img = mapSpritesheet.get('monster'+type)[0];}

	monsterArray.push(new Monster(x,y,width,height,type,img,dir));	
}