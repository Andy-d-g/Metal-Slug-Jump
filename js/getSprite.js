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
  "character_jump_top_left",
];

let mapSpritesheet = new Map();
let i = 0;

// Helper to handle paths on GitHub Pages vs Local
// Using a unique name to avoid conflict with other scripts
const getSpritePath = (path) => {
  // Check if we are hosted on GitHub Pages
  if (window.location.hostname.includes("github.io")) {
    // Clean path if it starts with ./
    const cleanPath = path.startsWith("./") ? path.slice(2) : path;
    return "/Metal-Slug-Jump/" + cleanPath;
  }
  return path;
};

/* Recupere les sprites d'un fichier puis les place dans l'array global */
function loadFile() {
  if (this.status == 200) {
    let json, img, arraySprite;
    arraySprite = [];
    json = JSON.parse(this.responseText);
    img = new Image();
    // Use dynamic path
    img.src = getSpritePath("img/" + repositoryArray[i] + "/spritesheet.png");
    img.onload = () => {
      let canvas, context, canvas2, context2;
      let w, h, x, y;
      let canvasImageData;

      canvas = document.createElement("canvas");
      canvas.height = json["meta"]["size"]["h"];
      canvas.width = json["meta"]["size"]["w"];
      context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);

      for (
        let j = 0;
        json["frames"][j.toString() + ".png"] !== undefined;
        j++
      ) {
        sprite = json["frames"][j.toString() + ".png"];
        w = sprite["sourceSize"]["w"];
        h = sprite["sourceSize"]["h"];
        x = sprite["frame"]["x"];
        y = sprite["frame"]["y"];
        canvas2 = document.createElement("canvas");
        canvas2.height = h;
        canvas2.width = w;
        context2 = canvas2.getContext("2d");
        canvasImageData = context.getImageData(x, y, w, h);
        context2.putImageData(canvasImageData, 0, 0);
        arraySprite.push(canvas2);
      }
    };
    mapSpritesheet.set(repositoryArray[i], arraySprite);
  }
}

const isSpriteSheetReady = () => {
  for (let j = 0; j < repositoryArray.length; j++) {
    if (
      !mapSpritesheet.has(repositoryArray[j]) ||
      !mapSpritesheet.get(repositoryArray[j]).length
    )
      return 0;
  }
  return 1;
};

/* Recupere les sprite de tout les fichier des dossier dans l'array global des noms de fichier */
const getAllSprite = () => {
  let path;
  i = 0; // Reset index for sequential processing
  repositoryArray.forEach((repository) => {
    let xobj = new XMLHttpRequest();
    xobj.onreadystatechange = loadFile;
    xobj.overrideMimeType("application/json");
    // Use dynamic path
    path = getSpritePath("img/" + repository + "/spritesheet.json");
    /*** Remettre en asynchrone pour + de performance ***/
    xobj.open("GET", path, false);
    xobj.send();
    i++;
  });
};
