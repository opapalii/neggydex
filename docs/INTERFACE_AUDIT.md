# Auditoría de interfaz y recorridos

## Base revisada

La versión anterior al rediseño y la actual mantienen los cinco apartados, ajustes, seis minijuegos, calculadora, equipos y combate local en `index.html`. El multijugador figura explícitamente como «Pronto» y no tiene implementación de servidor. El intercambio de equipos existente es un formato simplificado, no un importador completo de Showdown. Las capacidades competitivas no se han ampliado ni se afirma que la calculadora implemente todas las reglas de los juegos.

## Problemas abordados

- Intro sobre el botón de favorito también abría la ficha por propagación del teclado; Espacio no abría las tarjetas. Ahora se activa la tarjeta solo cuando tiene el foco y con Intro o Espacio.
- Los tipos en tarjetas dependían principalmente del color: se añaden 18 motivos SVG de pequeño tamaño, con símbolos independientes en dos esquinas para especies de dos tipos. La ficha sigue usando sus paisajes existentes y añade los mismos motivos. Los motivos pueden desactivarse en Ajustes; la preferencia se añade a la clave existente sin borrar otras opciones.
- Calculadora, tarjetas de juegos y preparación del combate usan las superficies del cuaderno y la calculadora incorpora jerarquía de pasos y nombres accesibles para especies. Las reglas y los controles siguen siendo los existentes.

## Validación realizada

En Chromium con PokéAPI real: búsqueda y ficha; Charizard fuego/volador en 375, 768 y 1440 px sin desbordamiento; crear, editar, guardar y recuperar equipo tras recargar; cálculo manual de daño; iniciar combate, ejecutar un ataque, rendirse y llegar al resultado. Los seis minijuegos se abrieron y se realizó una acción: Pokéwordle resuelto, cuatro juegos de adivinanza resueltos mediante sus entradas y una respuesta en Duelo de stats. Se observaron resultados de juego guardados en localStorage. El combate es local; no se ha probado multijugador ni backend.

Las pruebas automatizadas cubren respuesta sin red, reintento, búsqueda, filtrado, favoritos, ficha, navegación, presentación de entrenador, 18 motivos distintos, preferencia persistida y teclado en tamaños móvil y escritorio. Los recorridos con PokéAPI real no están automatizados de forma reproducible en CI y dependen de red y datos externos.

## Límites pendientes

No se han auditado exhaustivamente todas las combinaciones de opciones de calculadora, los movimientos y resultados posibles de combate, ni todas las variantes y eventos de los juegos. La apariencia de equipos y la lógica de combate existentes no se han reconstruido; cualquier precisión competitiva adicional requiere trabajo específico y coordinación con el backend. Las pruebas no establecen que todos los controles de la aplicación funcionen en todas las circunstancias.
