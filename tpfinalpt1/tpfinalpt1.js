// Variables para saber qué pantalla mostrar y si los créditos están abiertos.
let pantallaActual = 1;
let creditosVisibles = false;
let movimientoCreditos = 180;
let musicaFondo;

// Imágenes que se usan en la historia.
let fondoBase;
let sprites = [];
let finales = [];

// Carga las imágenes antes de empezar el juego.
function preload() {
    fondoBase = loadImage("fondo.png");

    sprites[1] = loadImage("detective1.png");
    sprites[2] = loadImage("nona.png");
    sprites[3] = loadImage("gato.png");
    sprites[4] = loadImage("zorro.png");
    sprites[6] = loadImage("detective2.png");

    finales[1] = loadImage("final1.png");
    finales[2] = loadImage("final2.png");
    finales[3] = loadImage("final3.png");
}

// Prepara el lienzo y la música.
function setup() {
    createCanvas(800, 450);
    musicaFondo = new Audio("musicadefondo.mp3");
    musicaFondo.loop = true;
    musicaFondo.volume = 0.35;
    textFont("Georgia");
    textLeading(25);
    imageMode(CORNER);
    rectMode(CORNER);
}

// Esta función se repite y dibuja la pantalla actual.
function draw() {
    // Si abrimos los créditos, dibujamos solo esa pantalla.
    if (creditosVisibles == true) {
        dibujarCreditos();
        return;
    }

    // Las pantallas de la historia y los finales usan fondos distintos.
    if (pantallaActual <= 15) {
        dibujarFondoBase();
    } else {
        dibujarFondoFinal();
    }

    dibujarCabecera();

    // Cada número corresponde a una escena distinta.
    if (pantallaActual == 1) {
        dibujarPantalla("El Pequeño Detective está en su oficina tomando leche. ¡Suena el teléfono! La Nona dice: «¡Mi pastel de cumpleaños ha desaparecido!».", 1, ["¡Aceptar el caso e ir a la cocina!"]);
    }
    if (pantallaActual == 2) {
        dibujarPantalla("Llegas a la cocina. Hay harina en el suelo y dos rastros de glaseado: uno verde que va al jardín y uno morado hacia el pasillo.", 2, ["Seguir el rastro verde (Gatito)", "Seguir el rastro morado (Zorrito)"]);
    }
    if (pantallaActual == 3) {
        dibujarPantalla("Sigues el rastro verde hasta el jardín. Entre las plantas, descubres al Gatito Chibi con la cara manchada de glaseado.", 3, ["Interrogar al Gatito Chibi"]);
    }
    if (pantallaActual == 4) {
        dibujarPantalla("El Gatito confiesa asustado: «¡Miau! Probé un poco, pero el Zorrito también andaba por aquí merodeando».", 3, ["Ir a investigar el rastro morado del pasillo"]);
    }
    if (pantallaActual == 5) {
        dibujarPantalla("Decides investigar también el otro rastro y vas al pasillo de la biblioteca. Ves una cola esponjosa detrás del sillón.", 4, ["Echar un vistazo detrás del sillón"]);
    }
    if (pantallaActual == 6) {
        dibujarPantalla("¡Es el Zorrito Chibi! Esconde una cucharita con glaseado morado y dice: «¡Yo no fui, el pastel estaba abierto! Pero vi al Gatito cerca».", 4, ["Llevar al Zorrito a la sala con los demás"]);
    }
    if (pantallaActual == 7) {
        dibujarPantalla("Reúnes a ambos sospechosos en la sala principal. El Gatito y el Zorrito se señalan y se culpan mutuamente.", 5, ["Escuchar la revelación de la Nona"]);
    }
    if (pantallaActual == 8) {
        dibujarPantalla("La Nona entra a la sala y revela un detalle clave: ¡Su pastel tenía dos pisos! El inferior era verde y el superior morado.", 2, ["Examinar la bandeja vacía"]);
    }
    if (pantallaActual == 9) {
        dibujarPantalla("Observas la bandeja vacía: tiene marcas de garras pequeñas abajo y marcas de cucharita arriba.", 1, ["Interrogar a ambos sospechosos"]);
    }
    if (pantallaActual == 10) {
        dibujarPantalla("Al verse descubiertos, el Gatito admite haberse comido la base verde y el Zorrito la copa morada.", 5, ["Preguntar por la alacena"]);
    }
    if (pantallaActual == 11) {
        dibujarPantalla("Sin embargo, ambos aseguran que la alacena estaba abierta de par en par por culpa del viento.", 1, ["Inspeccionar el pestillo de la alacena"]);
    }
    if (pantallaActual == 12) {
        dibujarPantalla("Inspeccionas la alacena y confirmas que el pestillo está flojo. ¡Cayeron en la tentación al ver el pastel sin protección!", 1, ["Reunir a todos para el veredicto"]);
    }
    if (pantallaActual == 13) {
        dibujarPantalla("La Nona espera pacientemente tu decisión final en medio de la sala. Todos te miran expectantes.", 2, ["Tomar la decisión final"]);
    }
    if (pantallaActual == 14) {
        dibujarPantalla("¿Cuál es tu veredicto final para resolver el misterio del pastel desaparecido?", 6, ["Culpabilidad compartida", "Culpar solo al Gatito", "No culpar a nadie"]);
    }
    if (pantallaActual == 15) {
        dibujarPantalla("¡Espera, hay una última pista! Notas huellas diminutas que vienen desde la ventana abierta del fondo...", 1, ["Ver el resultado del caso"]);
    }
    if (pantallaActual == 16) {
        dibujarPantalla("¡FINAL 1: Culpa compartida!\nResponsabilizas al Gatito y al Zorrito. Ambos piden perdón y ayudan a la Nona a hornear un pastel nuevo.", 0, ["Volver al Inicio"]);
    }
    if (pantallaActual == 17) {
        dibujarPantalla("¡FINAL 2: Solo el Gatito!\nCulpas únicamente al Gatito por las huellas del jardín. El Zorrito queda libre, aunque todavía hay dudas.", 0, ["Volver al Inicio"]);
    }
    if (pantallaActual == 18) {
        dibujarPantalla("¡FINAL 3: Nadie es culpable!\nDecides no culpar a nadie. La Nona comparte unas galletas con todos y el misterio queda sin resolver.", 0, ["Volver al Inicio"]);
    }
}

// Dibuja el texto, el personaje y las opciones de una pantalla.
function dibujarPantalla(texto, numeroSprite, opciones) {
    dibujarNarrativa(texto);

    // En los finales no mostramos el personaje sobre la imagen del final.
    if (pantallaActual <= 15) {
        dibujarSprite(numeroSprite, 548, 190, 230, 245);
    }

    // Recorremos las opciones para dibujar un botón por cada una.
    for (let i = 0; i < opciones.length; i++) {
        dibujarBoton(opciones[i], 32, 218 + i * 62, 500, 52);
    }

    dibujarBoton("Créditos", 665, 17, 108, 30);
}

// Dibuja el fondo de la historia.
function dibujarFondoBase() {
    image(fondoBase, 0, 0, 800, 450);
}

// Dibuja la imagen que corresponde al final elegido.
function dibujarFondoFinal() {
    let numeroFinal = pantallaActual - 15;
    image(finales[numeroFinal], 0, 0, 800, 450);
}

// Muestra el título y el número de pantalla.
function dibujarCabecera() {
    noStroke();
    fill(42, 65, 62, 220);
    rect(0, 0, 800, 48);
    fill(255, 247, 222);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(18);
    text("¿QUIÉN COMIÓ EL PASTEL DE LA NONA?", 25, 24);
    textStyle(NORMAL);
    textAlign(RIGHT, CENTER);
    textSize(13);

    if (pantallaActual <= 15) {
        text("PANTALLA " + pantallaActual + " / 15", 642, 24);
    } else {
        text("FINAL " + (pantallaActual - 15) + " / 3", 642, 24);
    }
}

// Dibuja el recuadro y el texto de la historia.
function dibujarNarrativa(texto) {
    noStroke();
    fill(255, 249, 230, 236);
    rect(24, 58, 752, 132, 14);
    fill(48, 59, 52);
    textAlign(LEFT, TOP);
    textSize(17);
    textLeading(23);
    text(texto, 44, 76, 710, 100);
    textLeading(25);
}

// Dibuja el personaje que corresponde a la pantalla.
function dibujarSprite(numero, x, y, ancho, alto) {
    // El número 5 significa que aparecen el gato y el zorro juntos.
    if (numero == 5) {
        dibujarSprite(3, x - 18, y + 38, ancho * 0.58, alto * 0.82);
        dibujarSprite(4, x + ancho * 0.43, y + 38, ancho * 0.58, alto * 0.82);
    } else {
        image(sprites[numero], x, y, ancho, alto);
    }
}

// Dibuja un botón y cambia su color cuando el mouse está encima.
function dibujarBoton(etiqueta, x, y, ancho, alto) {
    let mouseEncima = mouseX >= x && mouseX <= x + ancho && mouseY >= y && mouseY <= y + alto;

    noStroke();
    if (mouseEncima == true) {
        fill(51, 105, 94);
    } else {
        fill(43, 79, 72);
    }
    rect(x, y, ancho, alto, 11);
    fill(250, 230);
    textAlign(LEFT, CENTER);
    textSize(15);
    text(etiqueta, x + 18, y + alto / 2);
}

// Dibuja los créditos y el botón para volver a la historia.
function dibujarCreditos() {
    // Los textos empiezan abajo y suben hasta su posición.
    if (movimientoCreditos > 0) {
        movimientoCreditos = movimientoCreditos - 3;
    }

    dibujarFondoBase();
    noStroke();
    fill(30, 43, 42, 226);
    rect(0, 0, 800, 450);
    fill(255, 243, 208);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(25);
    text("CRÉDITOS", 400, 70 + movimientoCreditos);
    textStyle(NORMAL);
    textSize(18);
    text("¿Quién comió el pastel de la Nona?", 400, 128 + movimientoCreditos);
    text("Una aventura de detectives chibi", 400, 174 + movimientoCreditos);
    text("Ilustraciones, programación y narrativa", 400, 226 + movimientoCreditos);
    text("Maia Florencia Romero 122873/2", 400, 256 + movimientoCreditos);
    text("Hecho con p5.js", 400, 310 + movimientoCreditos);
    text("Gracias por jugar", 400, 350 + movimientoCreditos);

    dibujarBoton("Volver a la aventura", 32, 393, 180, 40);
}

// Revisa si el clic cayó dentro de una opción.
function opcionSeleccionada(numeroOpcion) {
    let x = 32;
    let y = 218 + numeroOpcion * 62;
    return mouseX >= x && mouseX <= x + 500 && mouseY >= y && mouseY <= y + 52;
}

// Esta función revisa los clics y cambia de pantalla.
function mousePressed() {
    // La música comienza con el primer clic.
    if (musicaFondo.paused == true) {
        musicaFondo.play();
    }

    // Si estamos en créditos, el botón permite volver a la historia.
    if (creditosVisibles == true) {
        if (mouseX >= 32 && mouseX <= 212 && mouseY >= 393 && mouseY <= 433) {
            creditosVisibles = false;
        }
        return false;
    }

    // El botón de arriba abre los créditos desde cualquier pantalla.
    if (mouseX >= 665 && mouseX <= 773 && mouseY >= 17 && mouseY <= 47) {
        creditosVisibles = true;
        movimientoCreditos = 180;
        return false;
    }

    // Cada opción lleva a la siguiente escena o a uno de los finales.
    if (pantallaActual == 1) {
        if (opcionSeleccionada(0)) {
            pantallaActual = 2;
        }
    } else if (pantallaActual == 2) {
        if (opcionSeleccionada(0)) {
            pantallaActual = 3;
        } else if (opcionSeleccionada(1)) {
            pantallaActual = 5;
        }
    } else if (pantallaActual == 3) {
        if (opcionSeleccionada(0)) pantallaActual = 4;
    } else if (pantallaActual == 4) {
        if (opcionSeleccionada(0)) pantallaActual = 6;
    } else if (pantallaActual == 5) {
        if (opcionSeleccionada(0)) pantallaActual = 6;
    } else if (pantallaActual == 6) {
        if (opcionSeleccionada(0)) pantallaActual = 7;
    } else if (pantallaActual == 7) {
        if (opcionSeleccionada(0)) pantallaActual = 8;
    } else if (pantallaActual == 8) {
        if (opcionSeleccionada(0)) pantallaActual = 9;
    } else if (pantallaActual == 9) {
        if (opcionSeleccionada(0)) pantallaActual = 10;
    } else if (pantallaActual == 10) {
        if (opcionSeleccionada(0)) pantallaActual = 11;
    } else if (pantallaActual == 11) {
        if (opcionSeleccionada(0)) pantallaActual = 12;
    } else if (pantallaActual == 12) {
        if (opcionSeleccionada(0)) pantallaActual = 13;
    } else if (pantallaActual == 13) {
        if (opcionSeleccionada(0)) pantallaActual = 14;
    } else if (pantallaActual == 14) {
        if (opcionSeleccionada(0)) {
            pantallaActual = 16;
        } else if (opcionSeleccionada(1)) {
            pantallaActual = 17;
        } else if (opcionSeleccionada(2)) {
            pantallaActual = 18;
        }
    } else if (pantallaActual == 15) {
        if (opcionSeleccionada(0)) pantallaActual = 16;
    } else if (pantallaActual >= 16 && pantallaActual <= 18) {
        if (opcionSeleccionada(0)) pantallaActual = 1;
    }

    return false;
}
