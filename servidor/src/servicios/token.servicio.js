import jwt from 'jsonwebtoken';
import { ENTORNO } from '../configuracion/entorno.js';
import { SESION_HORAS } from '../constantes/http.js';

const SECRETO = ENTORNO.SECRETO_JWT || 'solo-para-desarrollo-local';

export const firmarToken = (usuario) =>
  jwt.sign({ sub: String(usuario._id), rol: usuario.rol }, SECRETO, { expiresIn: `${SESION_HORAS}h` });

/** Devuelve el contenido del token o null si es inválido o ha caducado. */
export const leerToken = (token) => {
  try {
    return jwt.verify(token, SECRETO);
  } catch {
    return null;
  }
};
