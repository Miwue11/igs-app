# IGS · Iberian Grading Services

Sistema de gestión de una empresa de gradeo de productos coleccionables.
TFG (proyecto intermodular de DAW): Miguel López Rodríguez.

**Todo es gratuito:** React + Vite, Node.js + Express, MongoDB Community Server, MongoDB Compass y el reenvío de puertos de VS Code para publicar la web.
**Todo el código está en español:** carpetas, archivos, colecciones, campos, rutas de la API, clases CSS y variables de entorno.

## Plazos de gradeo

| Servicio | Publicado como máximo en | Prioridad en la cola |
|---|---|---|
| Estándar, Cómics, Regradeo y Pedido en bloque | **14 días** (gradeo básico) | Normal |
| Express | 7 días | Alta |
| Premium | 3 días (más doble revisión) | Máxima |

- El plazo cuenta **desde que el cliente crea el pedido hasta que se publica el gradeo**, es decir, cuando el pedido pasa a «Completado». Cada pedido guarda su `fechaLimite` y su `fechaPublicacion`.
- **Orden de la cola** (`compartido/utilidades/cola.js`):
  1. Primero los pedidos cuyo paquete ya ha llegado.
  2. Después los urgentes (vencen en 3 días o menos o están fuera de plazo), por fecha límite.
  3. El resto, por prioridad del servicio y orden de llegada.

  Así los servicios caros pasan antes, pero un gradeo básico nunca se queda sin publicar en sus 14 días.
- El panel muestra para cada pedido «Quedan N días», «Vence pronto» o «Fuera de plazo». El cliente ve la fecha máxima de publicación al hacer el pedido y en «Mi cuenta».
- Los días y prioridades se cambian en `compartido/demo/datos.js` (catálogo de ejemplo) y en `compartido/constantes/plazos.js`.

## Etiqueta IGS

Cada producto gradeado lleva la etiqueta del slab con **año, expansión, nombre, nº de certificado y grado**
(componente `cliente/src/componentes/producto/EtiquetaIGS.jsx`). Se ve en la portada, en la ficha pública,
como vista previa al subir un producto y se puede imprimir desde el panel tras guardarlo.

| Nota | Nombre | Distintivo |
|---|---|---|
| 10 con las cuatro subnotas a 10 | PRISTINE | Rojo metálico |
| 10 (resto) y 9,5 | GEM MINT | Dorado |
| 9 hacia abajo | MINT, NM-MT… POOR | Plateado |

La regla está en `compartido/utilidades/grados.js` (`etiquetaGrado` y `nivelGrado`), así que cliente, servidor y demo dan siempre el mismo resultado.

## Recomendaciones de cartas oficiales (APIs gratuitas)

Al subir un producto TCG, en cuanto se escribe el nombre (o lo rellena la lectura de la etiqueta) el panel
recomienda las versiones oficiales de la carta. Al pulsar **Usar** se rellenan año, expansión, nº de tarjeta, rareza y marca.

| Juego | API | Clave |
|---|---|---|
| Pokémon | [TCGdex](https://tcgdex.dev) (español, inglés, japonés…) | No |
| Magic: The Gathering | [Scryfall](https://scryfall.com/docs/api) | No |
| Yu-Gi-Oh! | [YGOPRODeck](https://ygoprodeck.com/api-guide/) | No |

Las consulta el navegador directamente (`cliente/src/servicios/cartasOficiales.js`), por eso funcionan también en el modo demo
y en una web estática. El servidor las permite en su política de seguridad (CSP) en `servidor/src/aplicacion.js`.

La **lectura automática de la etiqueta con IA** (`POST /api/ia/etiqueta`) es opcional: necesita `ANTHROPIC_API_KEY`, que es de pago.
Sin ella el botón avisa y los datos se rellenan a mano o con las recomendaciones gratuitas.

## Estructura

```
igs-app/
├── compartido/             Código común cliente + servidor
│   ├── constantes/         roles, estados, catálogo, formatos, mensajes, plazos
│   ├── utilidades/         ids (IGS-2026-000001), grados, plazos, pedidos, cola
│   ├── validadores/        reglas pequeñas + esquemas de formularios
│   ├── demo/               datos de ejemplo (carga de datos y modo demo)
│   └── pruebas/            pruebas con node:test
├── servidor/               API REST (Node + Express + Mongoose)
│   ├── src/
│   │   ├── configuracion/  variables de entorno y conexión a MongoDB
│   │   ├── constantes/     códigos HTTP, sesión, colecciones, límites de subida
│   │   ├── modelos/        Usuario, Servicio, Pedido, Producto, Ticket, Contador
│   │   ├── servicios/      lógica de negocio (el «motor»)
│   │   ├── controladores/  traducen petición HTTP ↔ servicio
│   │   ├── rutas/          rutas + middlewares de cada recurso
│   │   ├── middlewares/    sesión y roles, validación, fotos, web, errores
│   │   └── utilidades/
│   ├── scripts/            cargarDatos.js · comprobar.js · copiaSeguridad.js
│   └── pruebas/
├── cliente/                Interfaz web (React + Vite)
│   └── src/
│       ├── constantes/     configuración, rutas, menús, textos fijos
│       ├── enrutador/      rutas (History API) y control de acceso por rol
│       ├── contexto/       sesión del usuario (ContextoSesion)
│       ├── hooks/          useCarga, useFormulario, useSesion…
│       ├── servicios/      capa de datos: api/ (servidor) y demo/ (en memoria)
│       ├── componentes/    ui/, estructura/ y una carpeta por área
│       ├── paginas/        páginas: piden los datos y montan los componentes
│       ├── estilos/        variables, base, componentes, estructura, páginas, panel, adaptable
│       └── utilidades/
└── docker-compose.yml      (opcional) MongoDB con Docker en vez de instalarlo
```

Colecciones de MongoDB: `usuarios`, `servicios`, `pedidos`, `productos`, `tickets` y `contadores`.

Los nombres en inglés que quedan son obligatorios: los de las librerías (`useState`, `Router`, `mongoose.Schema`…), el prefijo `use` de los hooks de React y los archivos que buscan las herramientas (`package.json`, `vite.config.js`, `index.html`, `index.js`).

## Programas necesarios (todos gratuitos)

- [Visual Studio Code](https://code.visualstudio.com/) con una cuenta de GitHub para reenviar puertos.
- [Node.js 22 LTS](https://nodejs.org/) o superior.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) y **MongoDB Compass**.
- (Opcional) [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools): las copias de seguridad funcionan sin ellas.

## Comandos

```bash
npm install            # instala todo
npm run comprobar      # ¿conecta con MongoDB? cuenta los documentos
npm run datos          # borra la base de datos «igs» y carga los datos de prueba
npm start              # compila la web y la sirve con la API en http://localhost:4000
npm run dev:servidor   # API con recarga automática (desarrollo)
npm run dev:cliente    # web con recarga automática en http://localhost:5173
npm run demo           # web sin servidor ni base de datos (datos en memoria)
npm run copia          # copia de seguridad (física + nube)
npm run restaurar      # restaurar una copia
npm test               # pruebas
```

Cuentas de prueba (contraseña `Igs-demo-2026`): `admin@igs.demo`, `trabajador@igs.demo` y `cliente@igs.demo`.

En **MongoDB Compass**, conecta con `mongodb://localhost:27017` y abre la base de datos `igs`.

## Publicar la web con VS Code

1. Ejecuta `npm start`.
2. En la pestaña **Puertos** de VS Code, elige **Reenviar un puerto**, escribe `4000` e inicia sesión con GitHub.
3. El puerto es privado por defecto. Para que lo vea el tribunal: clic derecho → **Visibilidad del puerto → Público**.

## Copias de seguridad

`npm run copia` guarda la base de datos en `servidor/copias/` y la copia a dos carpetas configuradas en `servidor/.env`:
- `COPIA_FISICA`: pendrive o disco externo (por ejemplo `E:/IGS-copias`).
- `COPIA_NUBE`: carpeta sincronizada con Google Drive u OneDrive.

No hace falta instalar nada más: si no están las MongoDB Database Tools, la copia se hace en JSON con Node (`igs_<fecha>.json.gz`). Si están instaladas, se usa `mongodump` (`igs_<fecha>.archive.gz`).

```bash
npm run restaurar                                    # lista las copias
npm run restaurar -- copias/igs_2026-10-26-12-20.json.gz   # restaura una (reemplaza los datos)
```

## API

| Método | Ruta | Acceso |
|---|---|---|
| POST | /api/acceso/registro · /entrar · /salir | público |
| GET | /api/acceso/yo | con sesión |
| GET | /api/servicios | público |
| GET | /api/productos/:idCertificado | público |
| POST | /api/productos (multipart: datos + fotos) | trabajador, admin |
| POST · GET | /api/pedidos · /api/pedidos/mios | cliente |
| GET | /api/pedidos/cola?estado= | trabajador, admin |
| PATCH | /api/pedidos/:codigo/estado | trabajador, admin |
| POST | /api/tickets | público |
| GET · PATCH | /api/tickets · /api/tickets/:codigo/estado | trabajador, admin |
| GET · PATCH | /api/usuarios · /api/usuarios/:id/rol | admin |
| POST | /api/ia/etiqueta (foto) | trabajador, admin |

La sesión es un JWT en una cookie `httpOnly` y las contraseñas se guardan cifradas con bcrypt.
