import { ErrorHttp } from '../utilidades/errorHttp.js';

/**
 * Límite sencillo de peticiones por IP (en memoria). Evita probar códigos UV a lo bruto.
 *   maximo: peticiones permitidas en cada ventana de `ventanaMs`.
 */
export const limitarIntentos = ({ maximo = 20, ventanaMs = 60_000 } = {}) => {
  const intentos = new Map();
  return (req, _res, next) => {
    const ahora = Date.now();
    const clave = req.ip;
    const recientes = (intentos.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
    recientes.push(ahora);
    intentos.set(clave, recientes);
    if (intentos.size > 10_000) intentos.clear();
    if (recientes.length > maximo) return next(new ErrorHttp(429, 'Demasiados intentos. Espera un minuto y vuelve a probar.'));
    return next();
  };
};
