AGRICOLA GARCIA - VERSION WEB COMPARTIDA

QUE HACE ESTA VERSION

- Abre como pagina web desde un link.
- Guarda los datos en un archivo central del servidor.
- Si varias personas abren el mismo link, trabajan sobre los mismos datos.
- Si se abre como archivo local, sigue guardando en ese equipo como antes.

PROBAR EN ESTA COMPUTADORA

1. Abre PowerShell en esta carpeta.
2. Ejecuta:
   npm start
3. Abre:
   http://localhost:3000

PUBLICAR COMO LINK

Sube esta carpeta a un hosting que pueda correr Node.js y conservar archivos.
El comando de inicio es:
   npm start

OPCION RECOMENDADA: RENDER

Esta carpeta ya incluye render.yaml para crear:
- Un servicio web Node.js.
- Un disco persistente montado en /data.
- DATA_FILE=/data/siembra-state.json.
- EDIT_KEY como clave opcional para editar.

En Render:
1. Sube la carpeta a un repositorio de GitHub.
2. En Render elige "New Blueprint".
3. Selecciona el repositorio.
4. Cuando pida EDIT_KEY, escribe una clave privada para editar.
5. Abre el link normal para consulta.
6. Para editar, abre:
   https://TU-LINK/#edit=TU_CLAVE

Variables opcionales:

- PORT: puerto que indique el hosting.
- DATA_FILE: ruta donde se guardara el archivo de datos.
- EDIT_KEY: clave opcional para que solo el link con permiso pueda editar.

PERMISOS

Sin EDIT_KEY:
  Cualquier persona con el link puede ver y editar.

Con EDIT_KEY:
  El link normal solo puede consultar.
  Para editar se usa:
  https://TU-LINK/#edit=TU_CLAVE

NOTA IMPORTANTE

Para que el guardado sea permanente en internet, el hosting debe conservar el
archivo de datos. Si usas un hosting gratuito sin disco permanente, puede borrar
los datos al reiniciar. En ese caso conviene conectar una base de datos.
