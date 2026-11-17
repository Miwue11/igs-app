import { resolve } from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENTORNO, ES_PRODUCCION } from './configuracion/entorno.js';
import { ORIGENES_API_CARTAS, ORIGENES_IMAGENES_CARTAS } from '../../compartido/index.js';
import { rutasApi } from './rutas/index.js';
import { servirWeb } from './middlewares/web.js';
import { servirFotoDeMongo } from './servicios/fotos.servicio.js';
import { rutaNoEncontrada, manejarErrores } from './middlewares/errores.js';

/**
 * Cabeceras de seguridad. Se permiten las fuentes de Google, las vistas previas de fotos (blob:)
 * y las APIs gratuitas de cartas oficiales (datos y miniaturas) que consulta el panel.
 */
const seguridad = helmet({
  contentSecurityPolicy: {
    directives: {
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', ...ORIGENES_IMAGENES_CARTAS],
      connectSrc: ["'self'", ...ORIGENES_API_CARTAS],
      // Sin esto el navegador intentaría pasar a https las peticiones de http://localhost
      upgradeInsecureRequests: null,
    },
  },
});

/** Crea la aplicación Express (sin arrancarla, para poder probarla). */
export const crearAplicacion = () => {
  const aplicacion = express();

  aplicacion.disable('x-powered-by');
  // Render pone un proxy delante: así Express sabe que la conexión original es https.
  if (ES_PRODUCCION) aplicacion.set('trust proxy', 1);
  aplicacion.use(seguridad);
  if (!ES_PRODUCCION) aplicacion.use(cors({ origin: ENTORNO.ORIGEN_CLIENTE, credentials: true }));
  aplicacion.use(express.json({ limit: '100kb' }));
  aplicacion.use(cookieParser());

  aplicacion.get('/fotos/:id', servirFotoDeMongo);
  aplicacion.use('/fotos', express.static(resolve(ENTORNO.CARPETA_FOTOS), { maxAge: '7d' }));
  // Las respuestas de la API dependen de la sesión de cada usuario: que ningún proxy ni caché compartida las guarde.
  aplicacion.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store, private'); next(); });
  aplicacion.use('/api', rutasApi);
  servirWeb(aplicacion);

  aplicacion.use(rutaNoEncontrada);
  aplicacion.use(manejarErrores);
  return aplicacion;
};
