import { resolve } from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENTORNO, ES_PRODUCCION } from './configuracion/entorno.js';
import { rutasApi } from './rutas/index.js';
import { servirWeb } from './middlewares/web.js';
import { rutaNoEncontrada, manejarErrores } from './middlewares/errores.js';

/** Cabeceras de seguridad. Se permiten las fuentes de Google y las vistas previas de fotos (blob:). */
const seguridad = helmet({
  contentSecurityPolicy: {
    directives: {
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      // Sin esto el navegador intentaría pasar a https las peticiones de http://localhost
      upgradeInsecureRequests: null,
    },
  },
});

/** Crea la aplicación Express (sin arrancarla, para poder probarla). */
export const crearAplicacion = () => {
  const aplicacion = express();

  aplicacion.disable('x-powered-by');
  aplicacion.use(seguridad);
  if (!ES_PRODUCCION) aplicacion.use(cors({ origin: ENTORNO.ORIGEN_CLIENTE, credentials: true }));
  aplicacion.use(express.json({ limit: '100kb' }));
  aplicacion.use(cookieParser());

  aplicacion.use('/fotos', express.static(resolve(ENTORNO.CARPETA_FOTOS), { maxAge: '7d' }));
  aplicacion.use('/api', rutasApi);
  servirWeb(aplicacion);

  aplicacion.use(rutaNoEncontrada);
  aplicacion.use(manejarErrores);
  return aplicacion;
};
