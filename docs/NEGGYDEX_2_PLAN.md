# NeggyDex 2.0

Base: `origin/main` (4cfd34e), con los controles RPG de 16ba1e0 ya integrados. Los dos juegos pendientes estaban juntos en d19d04d, en `frontend/complete-field-guide`. Se recuperó ese commit conservando los estilos de controles de main. Se mantiene el HTML autónomo y el formato de guardado.

| Fase | Estado de esta entrega |
|---|---|
| 1 · Identidad y navegación | Ruta de montaña original en SVG integrado, entrada e identificación de los cinco destinos, selección accesible y navegación con flechas, Inicio y Fin. Búsqueda con instrucción estable. |
| 2 · Herramientas | Cabeceras del laboratorio y de equipos integradas. Siguiente tarea: verificar evolución y acceso al equipo con datos representativos y mejorar la ficha. |
| 3 · Arena | Corregidos atajos de cambio y salida del selector obligatorio. Regresión de rendición antes y después de un turno. Rediseño de la arena pendiente. |
| 4 · Motor | Se conserva el motor existente. Gen. VI como referencia para una futura revisión del daño, críticos y megaevolución. La cobertura actual mezcla generaciones. |
| 5 · Recreativa | Ocho juegos disponibles tras recuperar Laboratorio de tipos y Pasaporte regional. Probados respuestas, registros y retorno al menú de los dos juegos recuperados. Pendiente la renovación de los demás. |
| 6 · Progreso | Pendiente tarjeta de entrenador. Los récords actuales siguen en el almacenamiento existente. |
| 7 · Pulido | Comparativas responsive e integración en Chromium. Pendientes audio, comprobación con servicios reales y auditoría de recursos externos. |

### Cobertura del combate local

| Estado | Alcance |
|---|---|
| Verificado con datos controlados | Entrada a combate, decisión de movimiento, consumo de PP, vuelta al menú después del turno, rendición antes y después de atacar, selección obligatoria de sustituto mediante teclado y ratón. |
| Parcial, identificado en el código | Orden por prioridad y velocidad, precisión del movimiento, daño físico/especial, STAB, tabla de tipos, críticos, variación, Forcejeo, cambios de estadísticas, sueño, congelación, quemadura, parálisis, veneno y veneno grave, curación, drenaje, retroceso, multigolpe, objetos seleccionados y megaevolución. Falta verificación individual contra reglas de referencia. |
| Pendiente de implementar o validar en el motor | Habilidades específicas, protección, confusión, evasión, clima, terrenos y peligros de entrada. No se atribuye al combate la cobertura de la calculadora. |

### Evidencia

Las [capturas](rpg-review/) comparan los cinco destinos en 375, 768 y 1440 px. Los archivos before y after usan el mismo catálogo de prueba en caché, con recursos remotos bloqueados. Permiten comprobar disposición, selección, contraste y encabezados incluso sin sprites. El paisaje es vectorial original dibujado para este proyecto. El acceso a neggy.dev devolvió 403 en el proxy antes de cargar la página.

Ejecutar desde la raíz: `node --test --test-concurrency=3 tests/*.cjs`. La prueba de arena sustituye la preparación remota de los equipos por datos fijos y usa una semilla. Ejecuta el bucle, los menús, las animaciones, el cálculo y el resultado reales. Quedan por cubrir victoria, derrota por debilitamiento, evolución, intercambio de equipos y efectos especiales de movimientos.
