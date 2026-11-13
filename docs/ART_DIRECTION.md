# NeggyDex · Cuaderno de expedición

## Dirección

Un cuaderno de exploración junto a una consola de campo: superficies tinta cálida, papel crema, salvia y coral; tipografía clara y números de catálogo. La información se organiza como capítulos y fichas de especies, no como paneles empresariales. El color de tipo acompaña al nombre y nunca es la única señal. Se mantiene el acento configurable, el sistema de datos existente y el pixel art ya disponible; no se incorporan imágenes con derechos desconocidos.

UI/UX Pro Max recomienda para exploración una presentación inmersiva con jerarquía, foco y movimiento reducido. Su resultado de 3D intensivo se descarta por coste y accesibilidad; se adopta profundidad mediante planos CSS y una guía visual de baja carga. La búsqueda de «warmth» propone tonos tierra y sombras suaves, adaptados aquí a una interfaz oscura legible.

## Estructura y fases

1. **Inicio y Pokédex:** bienvenida como portada, Pokémon del día como ficha destacada y accesos a las otras herramientas; navegación de secciones permanente, catálogo con búsqueda y filtros agrupados y tarjetas horizontales como entradas del cuaderno. Conservar filtros, búsqueda, favoritos, orden, enlaces y fichas. En móvil, navegación inferior y catálogo en una columna.
2. **Equipos:** mesa de preparación de seis ranuras y panel de edición que mantenga importación y datos locales.
3. **Combate:** escenario y HUD como escena de juego, sin modificar motor ni servidor. Respetar los entrenadores ya generados localmente.
4. **Calculadora y juegos:** paneles y reglas visuales del mismo cuaderno, conservando funciones.

Las fases posteriores deben seguir en ramas y PR independientes. El estado actual usa una barra superior, controles antes del saludo y cuadrícula homogénea; esta primera fase cambia el orden, la navegación, la composición de bienvenida y la geometría de las entradas. La Pokédex sigue siendo la vista inicial, sin crear una ruta incompatible.

## Accesibilidad y rendimiento

Enlaces y controles de 44 px cuando sea viable, foco visible, nombres accesibles, estados de error existentes y `prefers-reduced-motion`. No introducir un framework ni dependencia de imágenes adicionales. El catálogo reutiliza sprites ya empleados por el proyecto y reserva su espacio. No se atribuyen licencias nuevas a recursos existentes.
