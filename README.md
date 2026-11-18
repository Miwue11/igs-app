# IGS · Iberian Grading Services

Sistema de gestión de una empresa de gradeo de productos coleccionables.
TFG (proyecto intermodular de DAW): Miguel López Rodríguez.

**Todo es gratuito:** React + Vite, Node.js + Express, MongoDB Community Server, MongoDB Compass y el reenvío de puertos de VS Code para publicar la web.
**Todo el código está en español:** carpetas, archivos, colecciones, campos, rutas de la API, clases CSS y variables de entorno.

## Cómo funciona un pedido (cliente ↔ IGS)

El flujo está inspirado en PSA y BGS. Las reglas están en `compartido/utilidades/pedidos.js` y las usan igual el servidor y el modo demo.

1. **El cliente prepara el envío** en «Mi cuenta»: elige el servicio y declara **cada artículo** con su valor.
   En cartas TCG busca la carta en una API gratuita (ver abajo) y se rellenan expansión, año, número y rareza.
2. **Valor declarado**: cada servicio tiene un valor máximo por artículo (Estándar 500 €, Express 1.500 €, Premium sin límite).
   Si una carta lo supera, hay que elegir un servicio superior. El pedido en bloque exige **mínimo 20 artículos** de hasta 200 €.
3. **Importe** = precio del servicio × artículos + **envío de vuelta asegurado** (15 €).
4. **IGS recibe el paquete** → empieza a contar el plazo del servicio.
5. **En gradeo**: cada certificado sale de un artículo declarado. El gradeador pone las cuatro subnotas y la nota final
   **se calcula sola** (ver «Etiqueta IGS»). Si no se puede encapsular (alterada, posible falsificación, tamaño no estándar…)
   se marca **no gradeable** y se devuelve sin certificado, como los códigos «N» de PSA.
6. **Completado** (publicado) solo cuando todos los artículos están resueltos. Después, **Enviado** al cliente.
   Los estados avanzan de uno en uno; el servidor rechaza saltos.

El cliente ve en «Mi cuenta» el resultado de cada artículo: enlace a su certificado o el motivo por el que no se gradeó.

## Plazos de gradeo

| Servicio | Publicado como máximo en | Prioridad en la cola |
|---|---|---|
| Estándar, Cómics, Segunda Opinión y Lote Pro | **14 días** | Estándar |
| Express | 7 días | Preferente |
| Premium | 3 días (más doble revisión) | Máxima |

- El plazo cuenta **desde que IGS recibe el paquete hasta que se publica el gradeo** (pedido «Completado»), como en PSA y BGS. Así el tiempo que el cliente tarda en enviarlo no cuenta en contra de IGS. Cada pedido guarda `fechaLlegada`, `fechaLimite` y `fechaPublicacion`.
- **Orden de la cola** (`compartido/utilidades/cola.js`):
  1. Primero los pedidos cuyo paquete ya ha llegado.
  2. Después los urgentes (vencen en 3 días o menos o están fuera de plazo), por fecha límite.
  3. El resto, por prioridad del servicio y orden de llegada.

  Así los servicios caros pasan antes, pero un Gradeo Estándar nunca se queda sin publicar en sus 14 días.
- El panel muestra para cada pedido «Quedan N días», «Vence pronto» o «Fuera de plazo». Antes de llegar el paquete se muestra «Empieza al recibir el paquete»; después, la fecha máxima en «Mi cuenta».
- Los días y prioridades se cambian en `compartido/demo/datos.js` (catálogo de ejemplo) y en `compartido/constantes/plazos.js`.

## Demo publicada en GitHub Pages

**https://miwue11.github.io/igs-app/** — versión demo (datos en memoria, sin servidor ni MongoDB).
Se publica sola con cada push a `master` (`.github/workflows/pages.yml`): pasa las pruebas, compila con
`--mode demo` y sube `cliente/dist` a la rama `gh-pages`.

## Versión completa en Render + MongoDB Atlas (gratis)

`render.yaml` deja preparado el despliegue: Express sirve la API y la web en la misma URL.

1. **MongoDB Atlas** → crea un clúster **M0 (Free)**, un usuario de base de datos y, en *Network Access*, permite `0.0.0.0/0`
   (Render no tiene IP fija). Copia la cadena de conexión y añade el nombre de la base de datos `igs`:
   `mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/igs?retryWrites=true&w=majority`
2. **Render** → *New → Blueprint*, conecta GitHub y elige este repositorio. Pega la cadena en `URI_MONGODB` y crea el servicio.
3. En el primer arranque, como la base de datos está vacía, se cargan solos los datos de demo
   (contraseña de las cuentas `Igs-demo-2026`). Después ya no se vuelve a tocar.

En Render las fotos se guardan en MongoDB (`FOTOS_EN_MONGO=true`, colección `fotos`) porque su disco se borra en cada reinicio.
El plan gratuito se duerme tras 15 minutos sin visitas y tarda alrededor de un minuto en despertar.

## Etiqueta IGS

Cada producto gradeado lleva la etiqueta del slab con **año, expansión, nombre, nº de certificado y grado**.
La frontal está en `cliente/src/componentes/producto/EtiquetaIGS.jsx`. La **parte trasera** (`EtiquetaTraseraIGS.jsx`)
lleva el logo, un sello y un **código QR** que abre la ficha pública del certificado; el QR se genera sin librerías
externas en `compartido/utilidades/qr.js`. Se ven en la portada (fotos del slab por delante y por detrás) y en la ficha pública,
la frontal sale como vista previa al gradear, y las dos se imprimen desde el panel tras publicar el certificado.

| Nota | Nombre | Distintivo |
|---|---|---|
| 10 con las cuatro subnotas a 10 | PRISTINE | Etiqueta entera granate, letras crema y oro |
| 10 (resto) y 9,5 | GEM MINT | Crema con distintivo enmarcado en oro |
| 9 hacia abajo | MINT, NM-MT… POOR | Crema con distintivo enmarcado en plata |

**La nota final no se elige: se calcula con las subnotas** (centrado, esquinas, bordes y superficie), como en BGS:
media redondeada al 0,5 más cercano y nunca más de 1 punto por encima de la subnota más baja.
Ejemplos: 10/10/10/10 → **10 PRISTINE**; 10/10/10/9,5 → **10 GEM MINT**; 9,5/9,5/9,5/10 → **9,5 GEM MINT**; 10/10/10/6 → **7**.
En el panel la nota y la vista previa de la etiqueta cambian de color mientras se ponen las subnotas.

La regla está en `compartido/utilidades/grados.js` (`calcularNotaFinal`, `etiquetaGrado` y `nivelGrado`), así que cliente, servidor y demo dan siempre el mismo resultado.

## Anti-réplicas: código UV de cada slab

Cada slab lleva en la etiqueta trasera un **código de 8 caracteres impreso con tinta UV invisible** (solo se ve con una lámpara de 365 nm).
Se calcula con `HMAC-SHA256(clave secreta, nº de certificado)` en `servidor/src/servicios/codigoUV.servicio.js`:

- Cada certificado tiene un código distinto y **sin la clave nadie puede generar el de un certificado nuevo**.
- El código **no aparece en la ficha pública ni en la API pública**. El gradeador lo recibe al publicar el certificado.
- En la ficha pública, el comprador escribe lo que ve con la lámpara en «Comprueba el código UV» (`POST /api/productos/:id/verificar-uv`,
  con límite de intentos por IP). Si no coincide, es una réplica.
- Las fotos del certificado completan la protección: quien copie la etiqueta de un slab auténtico en otra carta queda en evidencia al compararlas.
- Impresión en dos pasadas desde el panel: **1. etiquetas** en color y **2. capa UV** (solo el código, en su sitio) con un cartucho de tinta UV invisible.
- La web simula la lámpara con el botón **«Ver con luz UV»**.

La clave es `CLAVE_UV` (si no existe se deriva de `SECRETO_JWT`). En producción, fíjala antes de imprimir slabs reales y **no la cambies**:
cambiarla invalidaría todos los códigos ya impresos. En el modo demo (GitHub Pages) se usa una clave de ejemplo en el navegador.

## Buscador de cartas oficiales (APIs gratuitas)

Al preparar un envío de cartas, el cliente escribe el nombre y elige la versión exacta que va a mandar.
Al pulsar **Añadir** se rellenan año, expansión, número, rareza y juego; solo tiene que poner el valor declarado.
Después el gradeador parte de esos datos y los comprueba con la carta física.

| Juego | API | Clave |
|---|---|---|
| Pokémon | [TCGdex](https://tcgdex.dev) (español, inglés, japonés…) | No |
| Magic: The Gathering | [Scryfall](https://scryfall.com/docs/api) | No |
| Yu-Gi-Oh! | [YGOPRODeck](https://ygoprodeck.com/api-guide/) | No |

Las consulta el navegador directamente (`cliente/src/servicios/cartasOficiales.js`), por eso funcionan también en el modo demo
y en una web estática. El servidor las permite en su política de seguridad (CSP) en `servidor/src/aplicacion.js`.

La **lectura automática de la etiqueta con IA** (`POST /api/ia/etiqueta`) es opcional: necesita `ANTHROPIC_API_KEY`, que es de pago.
Sin ella el botón avisa y se usan los datos que declaró el cliente.

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

Colecciones de MongoDB: `usuarios`, `servicios`, `pedidos`, `productos`, `tickets`, `contadores` y `fotos` (solo con `FOTOS_EN_MONGO=true`).

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
| POST | /api/productos/:idCertificado/verificar-uv | público (limitado) |
| GET | /api/productos/:idCertificado/codigo-uv | trabajador, admin |
| POST | /api/productos (multipart: datos + fotos; gradea un artículo del pedido) | trabajador, admin |
| POST · GET | /api/pedidos · /api/pedidos/mios | cliente |
| GET | /api/pedidos/cola?estado= | trabajador, admin |
| PATCH | /api/pedidos/:codigo/estado (solo al siguiente estado) | trabajador, admin |
| POST | /api/pedidos/:codigo/articulos/:indice/no-gradeable | trabajador, admin |
| POST | /api/tickets | público |
| GET · PATCH | /api/tickets · /api/tickets/:codigo/estado | trabajador, admin |
| GET · PATCH | /api/usuarios · /api/usuarios/:id/rol | admin |
| POST | /api/ia/etiqueta (foto) | trabajador, admin |

La sesión es un JWT en una cookie `httpOnly` y las contraseñas se guardan cifradas con bcrypt.
