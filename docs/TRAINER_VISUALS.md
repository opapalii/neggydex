# Presentación visual de entrenadores

Los entrenadores rivales de NeggyDex se generan localmente en `drawTrainer` mediante un lienzo de 34 × 48 píxeles. El código del repositorio determina sus clases, vestimenta, colores y nombres; se utiliza en la presentación VS y en la entrada a la arena. La misma función dibuja al profesor de los juegos. No existe un selector de entrenadores. El lienzo se presenta con proporción intacta, escalado entero y `image-rendering: pixelated`; los sprites en la arena conservan el escalado entero existente.

Esta fase reutiliza el arte generado por el proyecto y no incorpora ni copia sprites externos. No se ha verificado una licencia específica para el arte generado dentro del repositorio. Los sprites Pokémon existentes proceden de Pokémon Showdown y PokeAPI; esta fase no cambia sus fuentes ni presupone que estén disponibles para redistribución. Pokémon y sus personajes pertenecen a sus respectivos titulares.

La dirección de interfaz usa superficies cálidas, salvia, arcilla y crema, sombras discretas, foco visible y el acento configurable existente. Se reducen los efectos decorativos en la presentación y se respeta la preferencia de movimiento reducido. La guía de UI/UX Pro Max sugirió tonos terrosos y sombras suaves en «Nature Distilled»; se adapta a una interfaz de juego oscura sin aplicar texturas ni nuevas dependencias.

Como posible mejora futura, valorar retratos de mayor resolución encargados o licenciados para las mismas clases y con permisos de uso y distribución comprobables. No se sustituyen los entrenadores ni se afirma que existan ilustraciones autorizadas para ellos.
