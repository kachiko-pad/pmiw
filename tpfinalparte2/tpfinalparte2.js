//https://youtu.be/IDSTL2H7_R8

let juego;
let fondo;
let spritesDetective = {};
let spritesPistas = {};
let sonidoPop;
let musicaFondo;

const anchoJuego = 800;
const altoJuego = 450;
const duracionJuego = 60;
const pistasNecesarias = 30;
const tamanoObjeto = 92;
const tamanoDetective = 210;

// carga los fondos y sprites --------------------------------------------------
function preload() {
  fondo = loadImage("fondo.png");
  spritesDetective.idle = loadImage("detectivesprite1.png");
  spritesDetective.feliz = loadImage("detectivesprite2.png");
  spritesDetective.triste = loadImage("detectivesprite3.png");

  spritesPistas["pistacorrecta1.png"] = loadImage("pistacorrecta1.png");
  spritesPistas["pistacorrecta2.png"] = loadImage("pistacorrecta2.png");
  spritesPistas["pistacorrecta3.png"] = loadImage("pistacorrecta3.png");
  spritesPistas["pistaincorrecta1.png"] = loadImage("pistaincorrecta1.png");
  spritesPistas["pistaincorrecta2.png"] = loadImage("pistaincorrecta2.png");
  spritesPistas["pistaincorrecta3.png"] = loadImage("pistaincorrecta3.png");
}


function setup() {
  createCanvas(anchoJuego, altoJuego);
  textFont("Georgia");

  // la música empieza al iniciar una partida
  sonidoPop = new Audio("popsoundeffect.mp3");
  sonidoPop.preload = "auto";
  musicaFondo = new Audio("musicadefondo.mp3");
  musicaFondo.preload = "none";
  musicaFondo.loop = true;
  musicaFondo.volume = 0.3;

  // Estos arreglos contienen las clases que se pueden crear al azar ---------------
  
  const clasesCorrectas = [
    Huella,
    Frutilla,
    CerezaConCrema
  ];
  const clasesIncorrectas = [
    HuellaSospechosa,
    FrutillaPodrida,
    CerezaConCremaPodrida
  ];

  juego = new JuegoPistas(clasesCorrectas, clasesIncorrectas);
}


function draw() {
  juego.actualizar();
  juego.dibujar();
}

function mousePressed() {
  juego.clic(mouseX, mouseY);
  return false;
}

// Reproduce el efecto corto al seleccionar una pista y lo reinicia para cada clic ----------------------------------
function reproducirPop() {
  sonidoPop.currentTime = 0;
  sonidoPop.play().catch((error) => console.warn("No se pudo reproducir el sonido:", error));
}

// inicia la musica del juego y me avisa si tengo un error (ya que tuve demasiados errores con la musica de fondo, tuve que buscar soluciones en internet :,3) ---
function iniciarMusica() {
  if (musicaFondo.paused) {
    musicaFondo.play().catch((error) => console.warn(
      "No se pudo reproducir la música. Si abriste index.html como file://, usa un servidor local como Live Server.",
      error
    ));
  }
}

// Dibuja y mueve todos los objetos de un arreglo, y quita los que ya vencieron -------------------
// Se llama una vez para las pistas correctas y otra para las sospechosas -------------------------
function dibujarPistas(arregloPistas) {
  for (let i = arregloPistas.length - 1; i >= 0; i--) {
    arregloPistas[i].mover();
    arregloPistas[i].dibujar();

    if (arregloPistas[i].terminoTiempo()) {
      arregloPistas.splice(i, 1);
    }
  }
}

// Busca una pista seleccionada y la quita de su arreglo -------------------------------------------
function quitarPistaSeleccionada(arregloPistas, x, y) {
  for (let i = arregloPistas.length - 1; i >= 0; i--) {
    if (arregloPistas[i].contiene(x, y)) {
      return arregloPistas.splice(i, 1)[0];
    }
  }
  return null;
}

// Controla la expresión de la detective según el resultado de la última selección -------------------------------
class Detective {
  constructor() {
    this.reaccion = "idle";
    this.reaccionHasta = 0;
  }

  reaccionar(tipo) {
    this.reaccion = tipo;
    this.reaccionHasta = millis() + 700;
  }

  // Muestra el sprite de reposo, feliz o triste y el salto solo anima el acierto ------------------------------
  dibujar(x, y, tamano) {
    if (millis() > this.reaccionHasta) this.reaccion = "idle";
    const sprite = this.reaccion === "salto"
      ? spritesDetective.feliz
      : this.reaccion === "triste" ? spritesDetective.triste : spritesDetective.idle;
    const movimiento = this.reaccion === "salto" ? -abs(sin(frameCount * 0.25)) * 12 : 0;
    imageMode(CENTER);
    image(sprite, x, y + movimiento, tamano, tamano);
    imageMode(CORNER);
  }
}

// Mensaje flotante que confirma el cambio de pistas tras una selección ----------------------------------
class EfectoVisual {
  constructor(x, y, correcto) {
    this.x = x;
    this.y = y;
    this.texto = correcto ? "+1 pista" : "-1 pista";
    this.color = correcto ? [42, 133, 69] : [190, 48, 54];
    this.creadoEn = millis();
  }

 
  dibujar() {
    const edad = millis() - this.creadoEn;
    const transparencia = map(edad, 0, 650, 255, 0);
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], transparencia);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(19);
    text(this.texto, this.x, this.y - edad * 0.035);
    textStyle(NORMAL);
  }

  terminado() {
    return millis() - this.creadoEn > 650;
  }
}

// Administra el estado de las pantallas, el temporizador y el contador de pistas ------------------------------------
class JuegoPistas {
  constructor(clasesCorrectas, clasesIncorrectas) {
    this.detective = new Detective();
    this.clasesCorrectas = clasesCorrectas;
    this.clasesIncorrectas = clasesIncorrectas;
    this.estado = "inicio";
    this.pistasCorrectas = [];
    this.pistasIncorrectas = [];
    this.efectos = [];
    this.cantidadPistas = 0;
    this.inicioEn = 0;
    this.ultimoAparicion = 0;
  }

  // Comienza una partida nueva. El botón de reinicio reutiliza esta misma función -----------------------------------
  iniciar() {
    this.estado = "jugando";
    this.pistasCorrectas = [];
    this.pistasIncorrectas = [];
    this.efectos = [];
    this.cantidadPistas = 0;
    this.inicioEn = millis();
    this.ultimoAparicion = millis();
    iniciarMusica();
  }

  // Comprueba victoria/tiempo, crea objetos nuevos y limpia animaciones terminadas --------------------------------------
  actualizar() {
    if (this.estado === "jugando") {
      if (millis() - this.inicioEn >= duracionJuego * 1000) {
        this.terminar(false);
        return;
      }
      if (this.cantidadPistas >= pistasNecesarias) {
        this.terminar(true);
        return;
      }

      const cantidadEnPantalla = this.pistasCorrectas.length + this.pistasIncorrectas.length;
      if (millis() - this.ultimoAparicion > random(550, 850) && cantidadEnPantalla < 8) {
        const x = random(60, 740);
        const y = random(112, 292);

        if (random(1) < 0.5) {
          const ClaseCorrecta = random(this.clasesCorrectas);
          this.pistasCorrectas.push(new ClaseCorrecta(x, y));
        } else {
          const ClaseIncorrecta = random(this.clasesIncorrectas);
          this.pistasIncorrectas.push(new ClaseIncorrecta(x, y));
        }

        this.ultimoAparicion = millis();
      }
    }

    for (let i = this.efectos.length - 1; i >= 0; i--) {
      if (this.efectos[i].terminado()) this.efectos.splice(i, 1);
    }
  }

  // Cambia a uno de los dos resultados cuando se alcanza el objetivo o termina el minuto -------------------
  terminar(gano) {
    this.estado = gano ? "victoria" : "derrota";
  }

// estado de cada pantalla -------------------------------------------------------------
  clic(x, y) {
    if (this.estado === "inicio") {
      if (this.dentro(x, y, 250, 255, 300, 64)) this.iniciar();
      else if (this.dentro(x, y, 305, 338, 190, 40)) this.estado = "instrucciones";
      return;
    }

    if (this.estado === "instrucciones" || this.estado === "creditos") {
      if (this.dentro(x, y, 135, 365, 150, 42)) this.estado = "inicio";
      else if (this.estado === "instrucciones" && this.dentro(x, y, 515, 365, 165, 42)) {
        this.iniciar();
      }
      return;
    }

    if (this.estado === "jugando") {
      if (this.dentro(x, y, 18, 18, 155, 38)) {
        this.iniciar();
        return;
      }

      const pistaCorrecta = quitarPistaSeleccionada(this.pistasCorrectas, x, y);
      if (pistaCorrecta) {
        this.registrarSeleccion(pistaCorrecta, x, y);
        return;
      }

      const pistaIncorrecta = quitarPistaSeleccionada(this.pistasIncorrectas, x, y);
      if (pistaIncorrecta) {
        this.registrarSeleccion(pistaIncorrecta, x, y);
        return;
      }
      return;
    }

    if (this.estado === "victoria" || this.estado === "derrota") {
      if (this.dentro(x, y, 145, 365, 240, 46)) this.estado = "inicio";
      else if (this.dentro(x, y, 415, 365, 220, 46)) this.estado = "creditos";
    }
  }

  // Aplica el resultado comun a cualquiera de las dos clases de pista -----------------------------------
  registrarSeleccion(pista, x, y) {
    this.cantidadPistas += pista.correcta ? 1 : -1;
    this.detective.reaccionar(pista.correcta ? "salto" : "triste");
    this.efectos.push(new EfectoVisual(x, y, pista.correcta));
    reproducirPop();
  }

  dibujar() {
    image(fondo, 0, 0, anchoJuego, altoJuego);
    if (this.estado === "inicio") this.dibujarInicio();
    if (this.estado === "instrucciones") this.dibujarInstrucciones();
    if (this.estado === "creditos") this.dibujarCreditos();
    if (this.estado === "jugando") this.dibujarPartida();
    if (this.estado === "victoria") this.dibujarFinal(true);
    if (this.estado === "derrota") this.dibujarFinal(false);
  }

  // Presenta la historia breve, el botón principal y el acceso a instrucciones ------------------------------------
  dibujarInicio() {
    this.dibujarPanel(120, 55, 560, 340);
    this.titulo("LA ÚLTIMA PISTA", 400, 111, 30);
    this.textoCentrado("La Nona encontró huellas diminutas junto a la ventana abierta.", 400, 164, 17, 490);
    this.textoCentrado("Ayúdala a reunir pruebas antes de emitir el veredicto.", 400, 198, 17, 490);
    this.dibujarBoton("COMENZAR INVESTIGACIÓN", 250, 255, 300, 64, [62, 116, 78], 18);
    this.dibujarBoton("Instrucciones", 305, 338, 190, 40);
    // La detective queda anclada en la esquina inferior derecha, igual que durante el juego.
    this.detective.dibujar(710, 395, tamanoDetective);
  }

  // las instrucciones :9 ------------------------------------------------------------------------------------------

  dibujarInstrucciones() {
    this.dibujarPanel(105, 55, 590, 365);
    this.titulo("INSTRUCCIONES", 400, 103, 27);
    this.textoCentrado("Tienes 60 segundos para llegar a 30 pistas.", 400, 157, 17, 510);
    this.textoCentrado("Busca huellas, frutillas y cerezas con crema que tengan aura verde.", 400, 196, 16, 510);
    this.textoCentrado("Las versiones sospechosas tienen aura roja y restan una pista.", 400, 230, 16, 510);
    this.textoCentrado("Los objetos aparecen y desaparecen. ¡Reacciona rápido!", 400, 264, 16, 510);
    this.dibujarBoton("Volver", 135, 365, 150, 42);
    this.dibujarBoton("Comenzar", 515, 365, 165, 42, [62, 116, 78]);
    // Se usa una pista correcta como ilustración de esta pantalla, no la detective.
    imageMode(CENTER);
    image(spritesPistas["pistacorrecta1.png"], 645, 310, tamanoObjeto, tamanoObjeto);
    imageMode(CORNER);
  }

  // Muestra los créditos de la historia y permite volver a la pantalla inicial ---------------------------------------
  dibujarCreditos() {
    this.dibujarPanel(105, 55, 590, 365);
    this.titulo("CRÉDITOS", 400, 109, 27);
    this.textoCentrado("Minijuego realizado con p5.js", 400, 174, 17, 500);
    this.textoCentrado("Historia base: ¿Quién comió el pastel de la Nona?", 400, 215, 16, 510);
    this.textoCentrado("Novela visual: Maia Florencia Romero", 400, 256, 16, 510);
    this.dibujarBoton("Volver", 135, 365, 150, 42);
  }

// la parte visual de el trabajo como botones, cajas de texto, etc -----------------------------------------------------
  dibujarPartida() {
    noStroke();
    fill(255, 239, 226, 235);
    rect(0, 0, anchoJuego, 72);
    fill(255, 239, 226, 235);
    rect(0, 334, anchoJuego, 116);

    dibujarPistas(this.pistasCorrectas);
    dibujarPistas(this.pistasIncorrectas);
    for (let i = 0; i < this.efectos.length; i++) this.efectos[i].dibujar();

    const segundos = max(0, duracionJuego - floor((millis() - this.inicioEn) / 1000));
    fill(226, 91, 91);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(16);
    text("TIEMPO", 400, 19);
    textSize(30);
    text(nf(floor(segundos / 60), 2) + ":" + nf(segundos % 60, 2), 400, 48);
    fill(72, 131, 104);
    textAlign(RIGHT, CENTER);
    textSize(26);
    text("Pistas: " + this.cantidadPistas + " / " + pistasNecesarias, 778, 37);
    textStyle(NORMAL);
    fill(72, 131, 104);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(28);
    text("Recolecta las pistas correctas", 370, 380);
    textStyle(NORMAL);
    this.dibujarBoton("Reiniciar juego", 18, 18, 155, 38);
    this.detective.dibujar(710, 395, tamanoDetective);
  }


  dibujarFinal(gano) {
    noStroke();
    fill(gano ? color(32, 63, 48, 220) : color(70, 43, 51, 220));
    rect(0, 0, anchoJuego, altoJuego);
    this.dibujarPanel(90, 62, 620, 330);
    this.titulo(gano ? "¡CASO ENCAMINADO!" : "EL TIEMPO SE ACABÓ", 400, 112, 28);
    if (gano) {
      this.textoCentrado("¡Encontraste las huellas que venían de la ventana!", 400, 180, 17, 530);
      this.textoCentrado("La última pista te permite continuar la investigación.", 400, 216, 16, 530);
    } else {
      this.textoCentrado("No llegaste a las 30 pistas antes de que terminara el minuto.", 400, 180, 16, 540);
      this.textoCentrado("El misterio sigue abierto. ¡Puedes intentarlo de nuevo!", 400, 216, 16, 530);
    }
    this.textoCentrado("Pistas reunidas: " + this.cantidadPistas, 400, 258, 17, 500);
    this.dibujarBoton("Volver a jugar", 145, 365, 240, 46, [62, 116, 78]);
    this.dibujarBoton("Créditos", 415, 365, 220, 46);
  }

  dibujarPanel(x, y, ancho, alto) {
    noStroke();
    fill(53, 38, 39, 65);
    rect(x + 5, y + 6, ancho, alto, 18);
    fill(255, 248, 238, 245);
    rect(x, y, ancho, alto, 18);
  }


  dibujarBoton(etiqueta, x, y, ancho, alto, colorBoton, tamanoTexto) {
    const encima = this.dentro(mouseX, mouseY, x, y, ancho, alto);
    noStroke();
    if (colorBoton) fill(colorBoton[0], colorBoton[1], colorBoton[2]);
    else if (encima) fill(83, 117, 95);
    else fill(91, 82, 76);
    rect(x, y, ancho, alto, 10);
    fill(255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(tamanoTexto || 14);
    text(etiqueta, x + ancho / 2, y + alto / 2);
    textStyle(NORMAL);
  }


  titulo(texto, x, y, tamano) {
    fill(61, 58, 60);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(tamano);
    text(texto, x, y);
    textStyle(NORMAL);
  }


  textoCentrado(texto, x, y, tamano, anchoMaximo) {
    fill(77, 70, 67);
    textAlign(CENTER, CENTER);
    textSize(tamano);
    const palabras = texto.split(" ");
    const lineas = [];
    let lineaActual = "";
    for (let i = 0; i < palabras.length; i++) {
      const candidata = lineaActual ? lineaActual + " " + palabras[i] : palabras[i];
      if (lineaActual && anchoMaximo && textWidth(candidata) > anchoMaximo) {
        lineas.push(lineaActual);
        lineaActual = palabras[i];
      } else {
        lineaActual = candidata;
      }
    }
    if (lineaActual) lineas.push(lineaActual);
    const altoLinea = tamano * 1.35;
    for (let i = 0; i < lineas.length; i++) {
      text(lineas[i], x, y + (i - (lineas.length - 1) / 2) * altoLinea);
    }
  }

  // Devuelve si un clic está dentro del rectángulo de un botón
  dentro(px, py, x, y, ancho, alto) {
    return px >= x && px <= x + ancho && py >= y && py <= y + alto;
  }
}
