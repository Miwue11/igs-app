import { mkdirSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { ENTORNO } from '../configuracion/entorno.js';
import { CAMPOS_FOTO, LIMITE_FOTO_MB } from '../constantes/http.js';
import { peticionIncorrecta } from '../utilidades/errorHttp.js';

const CARPETA = resolve(ENTORNO.CARPETA_FOTOS);
if (!ENTORNO.FOTOS_EN_MONGO) mkdirSync(CARPETA, { recursive: true });

const soloImagenes = (_req, archivo, listo) =>
  archivo.mimetype.startsWith('image/') ? listo(null, true) : listo(peticionIncorrecta('Solo se admiten imágenes.'));

const limits = { fileSize: LIMITE_FOTO_MB * 1024 * 1024 };

const enDisco = multer.diskStorage({
  destination: CARPETA,
  filename: (_req, archivo, listo) => listo(null, `${randomUUID()}${extname(archivo.originalname).toLowerCase()}`),
});

/** Fotos de un producto gradeado: anverso, reverso y etiqueta. En disco o en memoria (para guardarlas en MongoDB). */
const almacen = ENTORNO.FOTOS_EN_MONGO ? multer.memoryStorage() : enDisco;
export const subirFotosProducto = multer({ storage: almacen, fileFilter: soloImagenes, limits })
  .fields(CAMPOS_FOTO.map((name) => ({ name, maxCount: 1 })));

/** Foto de la etiqueta para la IA: se queda en memoria, no se guarda. */
export const subirEtiquetaEnMemoria = multer({ storage: multer.memoryStorage(), fileFilter: soloImagenes, limits })
  .single('etiqueta');
