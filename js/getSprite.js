const repositoryArray = [
	"hole", 
	"monster1", 
	"monster2_base",
	"monster2_die", 
	"platform_base", 
	"platform_break", 
	"platform_weak", 
	"trampoline", 
	"character_shoot_top",
	"character_jump_bottom_right", 
	"character_jump_top_right",
	"character_jump_bottom_left", 
	"character_jump_top_left"];

let mapSpritesheet = new Map();
let i = 0;

/* Recupere les sprites d'un fichier puis les place dans l'array global */
function loadFile() {
    if (this.status == 200) {
      	let json, img, arraySprite;
        arraySprite = [];
        json = JSON.parse(this.responseText);
        img = new Image();
        img.src = "./img/"+repositoryArray[i]+"/spritesheet.png";
        img.onload = () => {
        	let canvas, context, canvas2, context2;
        	let w, h, x, y;
        	let canvasImageData;

        	canvas = document.createElement('canvas');
        	canvas.height = json["meta"]["size"]["h"];
        	canvas.width = json["meta"]["size"]["w"];
        	context = canvas.getContext('2d');
            context.drawImage(img,0,0);

        	for (let i=0; json["frames"][i.toString()+".png"]!==undefined; i++){
                sprite = json["frames"][i.toString()+".png"];
        		w = sprite["sourceSize"]["w"];
        		h = sprite["sourceSize"]["h"];
        		x = sprite["frame"]["x"];
        		y = sprite["frame"]["y"];
        		canvas2 = document.createElement('canvas'); 
        		canvas2.height = h;
        		canvas2.width = w;
        		context2 = canvas2.getContext('2d');
        		canvasImageData = context.getImageData(x, y, w, h);
                context2.putImageData(canvasImageData,0,0);
        		arraySprite.push(canvas2);
       	    }
        }   
		mapSpritesheet.set(repositoryArray[i], arraySprite);
    }
}

const isSpriteSheetReady = () =>{
	for (let i = 0; i < mapSpritesheet.size; i++){
		if(!mapSpritesheet.get(repositoryArray[i]).length) return 0;
	}
	return 1;
}

/* Recupere les sprite de tout les fichier des dossier dans l'array global des noms de fichier */
const getAllSprite = () => {
    let path;
	repositoryArray.forEach(repository => {
        let xobj = new XMLHttpRequest();
		xobj.onreadystatechange = loadFile;
		xobj.overrideMimeType("application/json");
        path = "./img/" + repository + "/spritesheet.json";
		/*** Remettre en asynchrone pour + de performance ***/
        xobj.open("GET", path, false); 
		xobj.send();
        i++;
	});
	
}
