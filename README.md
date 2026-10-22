# CRIPTA 25: La última guardia

**Proyecto:** videojuego arcade 2D de eliminación de monstruos  
**Materia:** Graficación  
**Fecha:** 21 de octubre de 2026

## Contexto
En un cementerio gótico, cinco clases de criaturas sobrenaturales se mueven entre la niebla. El jugador actúa como guardia de la cripta y debe eliminarlas con una cruceta de puntería.

## Objetivo
Aplicar Canvas 2D, movimiento de objetos, detección de colisiones, interacción con el mouse, contador y recursos multimedia locales en una página web.

## Justificación
El proyecto permite practicar animación por fotogramas, coordenadas, vectores de velocidad, colisiones, eventos de puntero, carga de imágenes y audio. El diseño de terror crea una identidad visual clara para el juego.

## Cómo ejecutar
1. Descomprime la carpeta `videojuego2d`.
2. Abre `index.html` en un navegador moderno. Para evitar restricciones locales, se recomienda iniciar un servidor local:
   - VS Code: extensión Live Server y seleccionar **Open with Live Server**.
   - Python instalado: ejecutar `python -m http.server 8000` desde la carpeta y abrir `http://localhost:8000`.
3. Pulsa **Iniciar partida**. Haz clic sobre los monstruos para eliminarlos.
4. Pulsa **Activar audio** para iniciar el ambiente de terror. El navegador requiere una acción explícita para reproducir sonido.
5. Completa los datos del equipo y números de control en el pie de página antes de entregar.

## Operación y reglas implementadas
- Se crean 25 monstruos y se mantienen 25 activos después de cada clic acertado.
- Los monstruos se desplazan con velocidades distintas y trayectorias verticales, diagonales o circulares.
- Los objetos rebotan contra los límites del canvas y entre sí; el choque genera un destello/partículas breves.
- Al acertar con el mouse, el monstruo se elimina y reaparece aleatoriamente en otra zona.
- El HUD muestra eliminaciones, objetivos activos y precisión de clics.
- La cruceta naranja sustituye el puntero dentro del área de juego.
- Se incluye un escenario de cementerio, favicon, cinco imágenes de monstruos y música ambiental original sintetizada.
- Los controles permiten iniciar, pausar, reiniciar y activar/desactivar el audio.

## Estructura
```text
videojuego2d/
├── index.html
├── styles.css
├── game.js
├── README.md
└── assets/
    ├── cementerio-nocturno.jpg
    ├── vampiro.png
    ├── frankenstein.png
    ├── hombre-lobo.png
    ├── esqueleto.png
    ├── jinete-sin-cabeza.png
    ├── favicon.png
    └── ambiente-terror.wav
```

## Tecnologías
- HTML5 y Canvas 2D.
- CSS3 y Bootstrap 5.3.3 desde CDN.
- JavaScript nativo.
- PNG/JPG para gráficos y WAV para audio.

## Publicación con Git y GitHub Pages
Desde una terminal abierta dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Versión inicial de Cripta 25"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Después, en GitHub: **Settings → Pages → Deploy from a branch → main → /(root) → Save**. Sustituye `USUARIO/REPOSITORIO` por los datos reales. Espera a que termine el despliegue y abre la URL publicada para comprobar imágenes, audio y funcionamiento remoto.

Para registrar cambios posteriores:
```bash
git add .
git commit -m "Descripción breve del cambio"
git push
```

## Conclusiones
Este prototipo integra los requisitos centrales del ejercicio: 25 objetos animados, movimientos variados, colisiones, selección mediante mouse, contador, imagen y sonido de fondo, favicon, interfaz con Header/Main/Footer e instrucciones. En una siguiente iteración se pueden añadir rondas, dificultad progresiva, vidas, tipos de munición, efectos de sonido por impacto y una pantalla final.

## Créditos
Desarrollador(es): **[Completar nombres]**  
Números de control: **[Completar]**  
Profesor: M.T.I. Luis Alejandro Santana Valadez
