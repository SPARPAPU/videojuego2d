# Instituto Tecnológico de Pachuca
## Ingeniería en Sistemas Computacionales
### Graficación
Práctica: **NIGHTMARE SLAYER | PROTOCOLO NS-25**
Autor: **Luis Daniel Padilla Paz**
Fecha: **21 de octubre del 2026**

## 1. Contexto del videojuego

*Nightmare Slayer | Protocolo NS-25* es un videojuego de disparos en 2D con temática de terror, ambientado en el Cementerio Viejo. El proyecto presenta una operación de contención nocturna en la que el jugador debe neutralizar objetivos sobrenaturales antes de que la situación se vuelva incontrolable. Su identidad visual se inspira en los archivos de operaciones especiales y en una atmósfera oscura relacionada con las pesadillas y las criaturas clásicas del terror.

El videojuego presenta cinco tipos de enemigos: Drácula o vampiro, Frankenstein, hombre lobo, esqueleto y jinete sin cabeza. A lo largo de la partida, el jugador se enfrenta a 25 objetivos que se desplazan por el escenario, por lo que debe mantener la precisión de sus disparos y administrar sus recursos para completar la operación.

El sistema de juego incorpora puntuación, precisión de disparos, siete vidas y un cargador con capacidad para diez balas, además de una recarga automática de tres segundos. También incluye movimiento de los enemigos, rebotes contra los límites del escenario y entre criaturas, efectos visuales de colisión y audio ambiental. El proyecto fue desarrollado utilizando HTML, CSS y JavaScript, con el elemento Canvas para representar los gráficos y gestionar la interacción del jugador.

## 2. Objetivo del videojuego

El objetivo principal de *Nightmare Slayer | Protocolo NS-25* es neutralizar los objetivos sobrenaturales durante la operación de contención, obtener la mayor puntuación posible y evitar que los errores del jugador provoquen el fracaso de la misión.

El jugador dispone de siete vidas y un cargador de diez balas. Cada disparo acertado contribuye a la puntuación, mientras que los disparos fallidos reducen las vidas disponibles. Cuando se agota la munición, debe esperar tres segundos para completar la recarga automática.

Para cumplir el objetivo, el jugador debe apuntar con precisión, administrar la munición y reaccionar a los movimientos de los enemigos. La pérdida de todas las vidas representa el fracaso del protocolo de contención y activa la pantalla de finalización de la partida, identificada como *GAME OVER*.

## 3. Justificación

El desarrollo de *Nightmare Slayer | Protocolo NS-25* permite aplicar conocimientos de programación y graficación mediante la creación de un videojuego interactivo en dos dimensiones. El proyecto integra elementos gráficos, animación, movimiento de objetos, detección de colisiones y respuesta a las acciones del usuario.

La incorporación de cinco tipos de criaturas sobrenaturales, un sistema de puntuación, precisión de disparos, vidas y munición permite establecer reglas claras y ofrecer un desafío que requiere coordinación y administración de recursos. Asimismo, los efectos visuales producidos durante las colisiones permiten representar las interacciones entre los objetos del escenario.

La temática se desarrolló alrededor de una operación de contención nocturna para proporcionar una identidad narrativa y visual al videojuego. Los elementos gráficos del cementerio, los sonidos ambientales y los efectos de fin de partida refuerzan la atmósfera de terror y contribuyen a diferenciar el proyecto de un juego de disparos convencional.

Además, el uso de HTML, CSS, JavaScript y Canvas permite comprender cómo se construyen entornos interactivos desde tecnologías web, mientras que el almacenamiento del código fuente en GitHub facilita la organización, el control de versiones y la presentación del proyecto académico.

## 4. Operación del videojuego

Para ejecutar *Nightmare Slayer | Protocolo NS-25*, el usuario debe abrir el archivo `index.html` desde un navegador web. Al cargar el juego, se presenta la interfaz del protocolo y el escenario del Cementerio Viejo. Desde la pantalla inicial, el jugador puede comenzar la operación y enfrentarse a los objetivos sobrenaturales.

El funcionamiento del videojuego es el siguiente:

1. **Inicio de la operación:** se inicializa el escenario, se cargan los recursos gráficos y de audio y se generan los 25 objetivos. La partida comienza con siete vidas y diez balas disponibles.
2. **Neutralización de objetivos:** el jugador utiliza el mouse para apuntar y disparar contra los enemigos que se desplazan por el escenario. Los disparos acertados permiten sumar puntos y mantener el progreso de la operación.
3. **Sistema de puntuación y precisión:** el videojuego registra los disparos realizados, los aciertos y la puntuación obtenida, mostrando la precisión alcanzada por el jugador.
4. **Sistema de vidas:** el jugador dispone de siete vidas. Los disparos fallidos reducen las vidas disponibles, por lo que debe procurar acertar en sus objetivos para evitar el fracaso de la operación.
5. **Administración de munición:** el cargador tiene una capacidad de diez balas. Cuando se agota, se activa una recarga automática de tres segundos antes de poder continuar disparando.
6. **Movimiento y colisiones:** los enemigos se desplazan por el escenario y rebotan contra los límites y entre sí. Las colisiones generan efectos visuales de chispas naranjas que representan las interacciones entre las criaturas.
7. **Sistema de audio:** durante la partida se reproduce música ambiental para reforzar la atmósfera de terror. Cuando se activa el estado *GAME OVER*, la música ambiental se detiene y se reproduce el sonido correspondiente al fracaso del protocolo.
8. **Pausa y reinicio:** el jugador puede pausar la partida o iniciar una nueva operación mediante los controles de la interfaz. Al reiniciar, se restablecen la puntuación, las vidas, la munición y los objetivos, y se vuelve a iniciar la música ambiental.
9. **Fin de la operación:** cuando se agotan las vidas, se muestra la pantalla de *GAME OVER* con la puntuación final, indicando que el protocolo de contención ha fracasado.

## Conclusión

En esta práctica desarrollé *Nightmare Slayer | Protocolo NS-25*, un videojuego de disparos en 2D con temática de terror, utilizando HTML, CSS, JavaScript y Canvas. El proyecto se contextualizó como una operación de contención de amenazas sobrenaturales en el Cementerio Viejo, en la que el jugador debe enfrentarse a cinco tipos de criaturas y neutralizar los objetivos de la misión.

Durante el desarrollo trabajé con movimiento y animación de objetos, detección de colisiones, interacción mediante el mouse y representación de elementos gráficos. También incorporé un sistema de puntuación, precisión de disparos, siete vidas, munición limitada, recarga automática y reproducción de música y efectos de sonido. Finalmente, añadí controles de pausa y reinicio para mejorar la interacción con el usuario. Con esta práctica reforcé mis conocimientos de graficación y programación de videojuegos, además de comprender la importancia de organizar y compartir el código fuente mediante GitHub.
