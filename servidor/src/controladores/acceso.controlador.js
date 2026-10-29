import { ES_PRODUCCION } from '../configuracion/entorno.js';
import { COOKIE_SESION, HTTP, SESION_HORAS } from '../constantes/http.js';
import { registrar, iniciarSesion } from '../servicios/acceso.servicio.js';
import { firmarToken } from '../servicios/token.servicio.js';

const opcionesCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: ES_PRODUCCION,
  maxAge: SESION_HORAS * 60 * 60 * 1000,
};

const abrirSesion = (res, usuario, status = HTTP.OK) =>
  res.cookie(COOKIE_SESION, firmarToken(usuario), opcionesCookie).status(status).json({ usuario });

export const registro = async (req, res) => abrirSesion(res, await registrar(req.body), HTTP.CREADO);

export const entrar = async (req, res) => abrirSesion(res, await iniciarSesion(req.body));

export const salir = (_req, res) => res.clearCookie(COOKIE_SESION, opcionesCookie).status(HTTP.SIN_CONTENIDO).end();

export const yo = (req, res) => res.json({ usuario: req.usuario });
