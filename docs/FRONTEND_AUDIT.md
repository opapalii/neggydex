# NeggyDex: auditoría y primera fase

## Estado actual

Sitio estático para GitHub Pages: `index.html` concentra HTML, CSS y JavaScript; no hay React, TypeScript, gestor de paquetes, compilación ni pruebas propias. No se requiere servidor de aplicación. PokéAPI suministra especies, tipos, detalles y evoluciones; GraphQL complementa traducciones. El inicio necesita múltiples peticiones y falla si PokéAPI no responde, aunque almacena datos en localStorage. Sprites y fuentes dependen de servicios externos.

La Pokédex incluye búsqueda con espera de 120 ms, filtros combinados de tipo, generación y favoritos, ordenación, ficha, estadísticas, evoluciones, debilidades, formas y favoritos. El constructor guarda equipos de seis y movimientos localmente; su importación/exportación es un formato simplificado, no Showdown completo. Hay calculadora de daño, combate local, juegos, Pokémon del día y ajustes de apariencia. No presupongas que el combate local representa al servidor futuro.

## Hallazgos y propuesta

- Las tarjetas acumulan reglas CSS repetidas, sombras de colores, rotación y animaciones continuas; dificulta mantener una jerarquía visual estable. El foco y el movimiento reducido necesitan comprobarse en componentes concretos.
- La dependencia de red bloquea la carga inicial y deja sin datos a otras vistas; conviene separar estado de carga, fallo y reintento, sin presentar datos inventados.
- La búsqueda reconstruye la cuadrícula completa; hay carga diferida de imágenes y `content-visibility`, pero conviene medir antes de optimizar.
- Controles como los filtros compactos y ciertos campos basados en placeholder necesitan revisión con teclado, lectores de pantalla y tamaños táctiles. Las reglas adaptativas existentes requieren pruebas reales en móvil.
- El equipo carece de edición competitiva completa y validación; el intercambio existente pierde propiedades. No afirmar compatibilidad completa con Showdown.
- No hay comparador general, filtros de estadísticas ni contrato de backend confirmado. El motor local existente no debe ampliarse para sustituir al futuro servidor.

UI/UX Pro Max sugirió una estética de juego oscura y jerarquía clara; su propuesta 3D intensiva se descarta por el coste y por la dirección solicitada. Mantener fondo oscuro, acento coral configurable, tipografía existente con alternativa de sistema, superficies sobrias y color de tipo como señal secundaria. Favorecer contraste, foco visible, interacción táctil y movimiento reducido.

## Arquitectura y roadmap

Mantener el sitio estático y separar gradualmente datos, renderizado y lógica en módulos nativos cuando haya pruebas que protejan cada extracción. No migrar a React sin autorización. Añadir pruebas de flujos clave y automatización antes de refactorizar. Prioridad: 1) accesibilidad y carga/errores; 2) datos y comparador con cálculos verificables; 3) equipo competitivo e intercambio Showdown con pruebas; 4) arena conectada solo tras acordar contrato con el backend. Después valorar sinergias, explorador de evoluciones e historial local; evitar enlaces de equipos hasta definir privacidad y formato.

## Primera implementación

Ajuste CSS aislado de tarjetas: superficies más tranquilas, menos animación y foco visible. No cambia datos, navegación ni backend. Comprobar en escritorio y móvil, con teclado y movimiento reducido; validar búsqueda y ficha cuando PokéAPI sea accesible. El trabajo posterior debe añadir estados de carga y reintento sin romper la caché existente.
