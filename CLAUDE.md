# Parámetros de audiencias

Proyecto para aprender React, aparte de `audiencias_v2-front`. Se crece de a un paso. El front real es la referencia; este repo no lo modifica.

## Cómo levantarlo

La misma imagen y el mismo ritual que audiencias. Otro nombre, otra carpeta y el puerto **3001** en el navegador, para poder tener los dos contenedores a la vez.

```bash
docker run -dt --name parametrosAudiencias -p 3001:3000 \
  -v /home/silvia/proyectos/misProyectosReact/parametros-audiencias:/home \
  node:18.12.0

docker exec -w /home parametrosAudiencias npm install
docker exec -w /home parametrosAudiencias npm run dev
```

Abrir `http://localhost:3001`.

El listado de tipos de audiencia pega al backend de audiencias (`VITE_API_URL`, por defecto `http://localhost:3499`). Hace falta iniciar sesión con GIDP (Firebase + Entra), igual que en `audiencias_v2-front`. Después del login hay que elegir fuero, organismo y rol (`src/stores/contextoUsuario.ts`); el rol viaja en `x-user-role`. Las variables están en `.env`. El alta de tipos de audiencia ya va a la API (`POST /tipos-audiencia/`); modificación y baja todavía no.

- `npm` se corre **dentro** del contenedor. `node_modules` queda de root.
- Vite escucha en el 3000 del contenedor (`vite.config.ts`, `host: true`). El `-p 3001:3000` lo publica en el 3001 de la máquina.
- No hace falta un `npm install vite@latest` aparte. Vite 6 está en `package.json` porque Node 18.12 no ejecuta Vite 8.

En otra máquina, el `-v` usa la ruta real de esta carpeta. Audiencias, en el servidor, está bajo `/home/sistemas/proyectos/...`.
