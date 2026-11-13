# Necesidades de integración del frontend

Este documento describe necesidades, no un contrato acordado. El servidor y su implementación pertenecen al equipo de backend. No hay rutas, formatos de mensajes ni eventos definitivos; deben acordarse y versionarse antes de conectar la interfaz.

## Información necesaria

- Ciclo de partida: estado de conexión, creación o acceso a una partida, reconexión, turno y fin de partida; distinguir conexión perdida de derrota.
- Vista autorizada de cada jugador: integrantes visibles, Pokémon activos, PS, estados y acciones disponibles. El servidor debe decidir qué información puede ver cada participante.
- Envío de elecciones de movimiento o cambio y respuesta de aceptación o error; prevenir duplicados y estados obsoletos tras reconectar.
- Validación de equipos y formato: resultado legible por campo y versión de reglas. La validación definitiva corresponde al servidor.
- Historial de acciones autorizado, resultado y motivo de finalización. Acordar límites, orden y recuperación de eventos omitidos.

Quedan por acordar con Claude los tipos, transporte, autenticación, mensajes, reglas de reconexión, errores y compatibilidad de versiones. La UI existente de combate local no representa datos del servidor. Aislar en un adaptador futuro el transporte y mapear sus datos a estados de presentación; permitir que la Pokédex siga funcionando sin ese servicio.

## Configuración y seguridad

Para producción se propone el origen `https://api.neggy.dev`, sujeto a disponibilidad y acuerdo. Usar una URL base pública configurable por despliegue y validarla con `URL`: exigir HTTPS en producción, rechazar credenciales incrustadas y restringir el origen a una lista explícita; cualquier excepción HTTP local debe limitarse al desarrollo. No guardar secretos en el código estático, GitHub Pages ni variables expuestas al navegador. Esta configuración representa un origen, no define rutas.

El backend deberá controlar autenticación y autorización, TLS, límites, orígenes CORS explícitos y, si se acuerda WebSocket, validación del origen y transporte `wss:`. Evitar tokens en URLs y registros; decidir con el backend la gestión segura de sesión, protección CSRF cuando proceda y política de reconexión. Configurar CSP `connect-src` para los orígenes realmente necesarios al integrar, y no habilitar acceso universal. La configuración propuesta es independiente del proveedor de alojamiento; Azure solo sería un destino operativo.
