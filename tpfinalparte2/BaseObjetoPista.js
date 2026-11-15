// Clase base compartida por todas las pistas.
// aca asigno msa o menos el movimiento, el dibujo, el tiempo en pantalla ni la deteccion de clics
class ObjetoPista {
  constructor(x, y, nombre, archivoImagen, correcta) {
    this.x = x;
    this.y = y;
    this.nombre = nombre;
    this.archivoImagen = archivoImagen;
    this.correcta = correcta;
    this.imagen = spritesPistas[archivoImagen];

    this.ancho = tamanoObjeto;
    this.alto = tamanoObjeto;
    this.velocidadX = random(-0.65, 0.65);
    this.velocidadY = random(-0.35, 0.35);
    this.aparecioEn = millis();
    this.duracion = random(2500, 4300);
    this.fase = random(TWO_PI);
  }

  // Mueve la pista y la hace rebotar dentro del area de juego -----------------------
  mover() {
    this.x += this.velocidadX;
    this.y += this.velocidadY;

    if (this.x < 52 || this.x > 748) this.velocidadX *= -1;
    if (this.y < 100 || this.y > 310) this.velocidadY *= -1;
  }

  // Dibuja la imagen con un aura verde o roja ------------------------------
  dibujar() {
    const pulso = 1 + sin(frameCount * 0.12 + this.fase) * 0.06;
    const contexto = drawingContext;

    push();
    translate(this.x, this.y);
    scale(pulso);
    contexto.save();
    contexto.shadowBlur = 25;
    contexto.shadowColor = this.correcta
      ? "rgba(80, 255, 116, 0.95)"
      : "rgba(255, 55, 70, 0.95)";

    imageMode(CENTER);
    image(this.imagen, 0, 0, this.ancho, this.alto);
    contexto.restore();
    imageMode(CORNER);
    pop();
  }

  // Las pistas desaparecen solas despues de unos segundos -------------------------------
  terminoTiempo() {
    return millis() - this.aparecioEn > this.duracion;
  }

  // Comprueba si el clic esta cerca del centro de la imagen.
  contiene(px, py) {
    return dist(px, py, this.x, this.y) < this.ancho * 0.48;
  }
}
