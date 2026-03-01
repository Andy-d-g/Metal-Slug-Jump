const cnv = document.getElementById("myCanvas");
const ctx = cnv.getContext("2d");

const BACKGROUND = new Image();
BACKGROUND.src = "img/bck.png";

const PLAY_BUTTON = new Image();
PLAY_BUTTON.src = "img/play-on.png";

let audio = new Audio("song/background-song.mp3");

const APESANTEUR = 2;
const MAX_SPEED = 15 * APESANTEUR;
const MAX_MOV = 20;
const LARG_PLATFORM = 50;
const HAUT_PLATFORM = 10;

let score = 0;
let bestScore = 0;
let mouvement = 0;

let platformArray = [];
let monsterArray = [];

let etatCle = {}; // tous les clé clavier ("true" si elle est appuyée)

let perso;
let shootFrame = 0;
let shootFrameDelay = 25;
let mousePos = { x: 0, y: 0 };
let mouseClicked = false;

let dead = false;
let play = true;
let isEverthingToStart = false;
let gameStarted = false; // New variable to control game start

/* Attrape tout les evenement de touche presser et libérer */
window.addEventListener(
  "keyup",
  function (e) {
    etatCle[e.keyCode || e.which] = false;
    /* mettre en pause le jeu */
    if (e.keyCode === 32 || e.keyCode === 80) {
      if (!dead) {
        if (play) play = false;
        else play = true;
      } else {
        dead = false;
      }
    }
  },
  true,
);
window.addEventListener(
  "keydown",
  function (e) {
    etatCle[e.keyCode || e.which] = true;
  },
  true,
);

/* click souris pour tirer */
cnv.addEventListener("mousedown", (e) => {
  mouseClicked = true;
  if (!gameStarted) {
    // Check if game hasn't started yet
    const rect = cnv.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate PLAY_BUTTON position (centered)
    const buttonX = (cnv.width - PLAY_BUTTON.width) / 2;
    const buttonY = (cnv.height - PLAY_BUTTON.height) / 2;

    // Check if click is within PLAY_BUTTON bounds
    if (
      mouseX >= buttonX &&
      mouseX <= buttonX + PLAY_BUTTON.width &&
      mouseY >= buttonY &&
      mouseY <= buttonY + PLAY_BUTTON.height
    ) {
      gameStarted = true; // Start the game
      audio.play().catch((err) => console.error("Audio playback failed:", err)); // Play audio on user interaction
    }
  }
});

/* Recommence la musique lorsqu'elle est terminée */
audio.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play().catch((err) => console.error("Audio loop failed:", err));
  },
  false,
);

/* retourne la position de la souris sur le canvas */
const getMousePos = (canvas, evt) => {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};
cnv.addEventListener(
  "mousemove",
  (evt) => {
    if (!dead) {
      mousePos = getMousePos(cnv, evt);
      /* option de animation delay */
      shootFrame = shootFrameDelay;
    }
  },
  false,
);

/* Gere les deplacement horizontaux */
const eventKeyboard = () => {
  if (etatCle[37] || etatCle[65]) {
    mouvement += MAX_MOV * -1;
  }
  if (etatCle[39] || etatCle[68]) {
    mouvement += MAX_MOV;
  }
};

/* Genere un nombre aleatoire entre min et max */
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/* Renvoi un resultat en fonction des probabilités données en parametre */
const getRandomCoef = (spec) => {
  let i,
    sum = 0,
    r = Math.random();
  for (i in spec) {
    sum += spec[i];
    if (r <= sum) return i;
  }
};

/* Renvoi un type aleatoire en fonction du score courant et de la rareté d'apparition des types */
const getRandomType = (score, objet) => {
  /* Changer les probabilité en fonction du score */
  const probPlatform = { 0: 0.35, 1: 0.2, 2: 0.1, 3: 0.1, 4: 0.05, 5: 0.2 };
  const probMonster = { 0: 0.969, 1: 0.008, 2: 0.008, 3: 0.015 };
  let prob;
  objet == "Monster"
    ? (prob = getRandomCoef(probMonster))
    : (prob = getRandomCoef(probPlatform));
  return prob;
};

/* Renvoi le nouveau nombre total de points */
const updateScore = (point) => {
  score += point;
};

/* Met a jour l'affiche de l'ecran lorsque le personnage depasse une certaine hauteur */
const upScreen = () => {
  let moveUp = Math.floor((perso.y + 300) / 10 / 4);
  updateScore(moveUp);
  updatePosHigh(moveUp, platformArray);
  updatePosHigh(moveUp, monsterArray);
  perso.y += moveUp;
};

/* Affiche le score */
const drawScore = () => {
  ctx.font = "30px serif";
  ctx.fillText("Best Score : " + bestScore, 10, 30);
  ctx.fillText("Score : " + Math.floor(score / 10), 10, 60);
};

/* Gere les evenements lorsque l'ecran monte */
const manageUp = () => {
  let type;
  for (let i = 0; i < (getRandom(0, 50) % 3) + 1; i++) {
    type = getRandomType(score, "Platform");
    createNewPlatform(type);
  }
  type = getRandomType(score, "Monster");
  type--;
  if (type != -1) createNewMonster(type);
  upScreen();
};

/* Rafraichis l'image du jeu */
const update = () => {
  if (!gameStarted) {
    // Display start screen if game hasn't started
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.drawImage(BACKGROUND, 0, 0, cnv.width, cnv.height);
    // Draw PLAY_BUTTON in the center
    const buttonX = (cnv.width - PLAY_BUTTON.width) / 2;
    const buttonY = (cnv.height - PLAY_BUTTON.height) / 2;
    ctx.drawImage(PLAY_BUTTON, buttonX, buttonY);
  } else if ((isEverthingToStart || isSpriteSheetReady()) && !dead) {
    if (!isEverthingToStart) {
      /* init */
      cnv.height = window.innerHeight;
      platformArray = [];
      monsterArray = [];
      audio.pause();
      audio.currentTime = 0;
      audio = new Audio("song/background-song.mp3");
      score = 0;
      perso = new Character(
        Math.floor(cnv.width / 2),
        Math.floor(cnv.height / 1.3),
      );
      genStartMap();
      perso.setSpeed(MAX_SPEED);
    }
    isEverthingToStart = true;
    if (play) {
      /* loop */
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      ctx.drawImage(BACKGROUND, 0, 0, cnv.width, cnv.height);
      drawScore();
      eventKeyboard();
      affichePlatform();
      afficheMonster();
      perso.jump();
      collisionMonsterBullets();
      if (perso.y <= 300) {
        manageUp();
      } else if (perso.y >= cnv.height || collisionMonster(perso)) {
        dead = true;
        isEverthingToStart = false;
        /* Definis le nouveau record */
        score = Math.floor(score / 10);
        if (score > bestScore) bestScore = score;
        score = 0;
        /* Change la musique */
        audio.pause();
        audio.currentTime = 0;
        audio = new Audio("song/death-song.mp3");
        audio.play().catch((err) => console.error("Death audio failed:", err));
      }
      updateAffichagePlatform(5);
      updateAffichageMonster(5);
    } else {
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      ctx.drawImage(BACKGROUND, 0, 0, cnv.width, cnv.height);
      drawScore();
      affichePlatform();
      afficheMonster();
      perso.affiche();
      ctx.fillText("PAUSE", cnv.width / 2 - 50, cnv.height / 3);
      ctx.fillText("[space:run]", cnv.width / 2 - 80, cnv.height / 3 + 50);
      eventKeyboard();
    }
  } else if (dead) {
    /* Si je suis mort */
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.drawImage(BACKGROUND, 0, 0, cnv.width, cnv.height);
    for (let i = 0; i < monsterArray.length; i++) {
      if (monsterArray[i].collision(perso)) monsterArray[i].affiche();
      else monsterArray.splice(i, 1);
    }
    if (!(perso.y >= cnv.height)) {
      perso.affiche();
    }
    ctx.fillText("RESTART", cnv.width / 2 - 68, cnv.height / 3);
    ctx.fillText("[space:run]", cnv.width / 2 - 80, cnv.height / 3 + 50);
  }
  setTimeout(update, 30);
};

/* Programme */
const startGame = () => {
  getAllSprite();
  update();
};

startGame();
