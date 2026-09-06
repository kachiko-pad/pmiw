let Estado = 0; 
let frameActual = 0;
let ultimoCambio = 0;
let velocidad = 150; 

let posX = 300; 
let posY = 380; 
let bgX = 0; 

// Arrays de animaciones --------------------------------------
let krisIdle = [];
let krisCaminandoDer = [];
let krisCaminandoIzq = [];
let fondo;


// fondo -------------------------------------------------------

let anchoFondoOriginal = 2396; 

function preload() {
  fondo = loadImage("underworld.png");
  
  // animaciones -----------------------------------------------
  
  for (let i = 1; i <= 4; i++) {
    krisIdle.push(loadImage("idle" + i + ".png"));
  }
  for (let i = 1; i <= 4; i++) {
    krisCaminandoDer.push(loadImage("kris" + i + ".png"));
  }
  for (let i = 5; i <= 8; i++) {
    krisCaminandoIzq.push(loadImage("kris" + i + ".png"));
  }
}

function setup() {
  createCanvas(800, 600);
  noSmooth();
  ultimoCambio = millis();
}

function draw() {
  background(19, 17, 55);
  
// efecto parallax
  bgX = - (posX * 0.3) % anchoFondoOriginal;
  
  if (bgX > 0) {
    bgX = bgX - anchoFondoOriginal;
  }
  
  if (fondo) {
    imageMode(CORNER);
    image(fondo, bgX, 0, anchoFondoOriginal, 500);
    image(fondo, bgX + anchoFondoOriginal, 0, anchoFondoOriginal, 500);
    image(fondo, bgX + (anchoFondoOriginal * 2), 0, anchoFondoOriginal, 500);
  }
  
  
// estados de movimiento para ver si s emueve o esta quieto-------------------------

  if (Estado === 1) { 
    posX += 3;
    if (posX > width + 50) posX = -50;
  } else if (Estado === 2) { 
    posX -= 3;
    if (posX < -50) posX = width + 50;
  }

  let animacionActual = krisIdle;
  if (Estado === 1) {
    animacionActual = krisCaminandoDer;
  } else if (Estado === 2) {
    animacionActual = krisCaminandoIzq;
  }

  ejecutarSistemaAnimacion(animacionActual, posX, posY, velocidad);

// Interfaz de texto ------------------------------------------------------------

  fill(255);
  textSize(18);
  textAlign(LEFT);
  text("D: Derecha | A: Izquierda | S: Bailar | R: Reiniciar", 20, 40);
}


function ejecutarSistemaAnimacion(arreglo, x, y, vel) {
  let f = obtenerIndice(arreglo.length, vel);
  let img = arreglo[f];

  if (img) {
    imageMode(CORNER);
    image(img, x, y);
  } else {
    fill(0, 255, 255);
    rect(x, y, 40, 80);
  }
}

function obtenerIndice(total, vel) {
  if (millis() > ultimoCambio + vel) {
    frameActual++;
    if (frameActual >= total) frameActual = 0;
    ultimoCambio = millis();
  }
  return frameActual;
}


// controles de interaccion-----------------------------------------------

function keyPressed() {
  if (key === 'd' || key === 'D') {
    Estado = 1; 
    frameActual = 0;
  }
  if (key === 'a' || key === 'A') {
    Estado = 2; 
    frameActual = 0;
  }
  if (key === 's' || key === 'S') {
    Estado = 0; 
    frameActual = 0;
  }
  if (key === 'r' || key === 'R') {
    Estado = 0;
    posX = 300;
    frameActual = 0;
    ultimoCambio = millis();
  }
}
