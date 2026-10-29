import { Usuario } from '../modelos/index.js';
import { COOKIE_SESION } from '../constantes/http.js';
import { leerToken } from '../servicios/token.servicio.js';
import { noAutenticado, prohibido } from '../utilidades/errorHttp.js';
import { manejadorAsync } from '../utilidades/manejadorAsync.js';

const usuarioDeLaPeticion = async (req) => {
  const datos = leerToken(req.cookies?.[COOKIE_SESION]);
  if (!datos) return null;
  const usuario = await Usuario.findById(datos.sub);
  return usuario?.activo ? usuario : null;
};

/** Exige sesión iniciada. Deja el usuario en req.usuario. */
export const autenticar = manejadorAsync(async (req, _res, next) => {
  req.usuario = await usuarioDeLaPeticion(req);
  if (!req.usuario) throw noAutenticado();
  next();
});

/** Igual que autenticar, pero deja pasar a los visitantes sin sesión. */
export const autenticacionOpcional = manejadorAsync(async (req, _res, next) => {
  req.usuario = await usuarioDeLaPeticion(req);
  next();
});

/** Restringe la ruta a ciertos roles. Úsalo después de autenticar. */
export const permitir = (...roles) => (req, _res, next) =>
  next(roles.includes(req.usuario?.rol) ? undefined : prohibido());
