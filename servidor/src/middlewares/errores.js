import { HTTP } from '../constantes/http.js';
import { ES_PRODUCCION } from '../configuracion/entorno.js';
import { ErrorHttp } from '../utilidades/errorHttp.js';

const CLAVE_DUPLICADA = 11000;

/** Traduce errores conocidos (multer, Mongoose, MongoDB) a un ErrorHttp. */
const normalizar = (error) => {
  if (error instanceof ErrorHttp) return error;
  if (error.code === 'LIMIT_FILE_SIZE') return new ErrorHttp(HTTP.DEMASIADO_GRANDE, 'La imagen es demasiado grande.');
  if (error.code === CLAVE_DUPLICADA) return new ErrorHttp(HTTP.CONFLICTO, 'Ese registro ya existe.');
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return new ErrorHttp(HTTP.PETICION_INCORRECTA, 'Los datos no son válidos.');
  }
  return null;
};

export const rutaNoEncontrada = (req, _res, next) =>
  next(new ErrorHttp(HTTP.NO_ENCONTRADO, `No existe la ruta ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const manejarErrores = (error, _req, res, _next) => {
  const conocido = normalizar(error);
  if (!conocido) console.error('[igs]', error);

  const status = conocido?.status ?? HTTP.ERROR_INTERNO;
  const mensaje = conocido?.message ?? 'Ha ocurrido un error inesperado.';
  res.status(status).json({
    error: mensaje,
    ...(conocido?.detalles && { detalles: conocido.detalles }),
    ...(!conocido && !ES_PRODUCCION && { traza: error.message }),
  });
};
