import { LIMITES } from '../../../compartido/constantes/formatos.js';

export const HTTP = Object.freeze({
  OK: 200,
  CREADO: 201,
  SIN_CONTENIDO: 204,
  PETICION_INCORRECTA: 400,
  NO_AUTENTICADO: 401,
  PROHIBIDO: 403,
  NO_ENCONTRADO: 404,
  CONFLICTO: 409,
  DEMASIADO_GRANDE: 413,
  ERROR_INTERNO: 500,
  NO_DISPONIBLE: 503,
});

export const COOKIE_SESION = 'igs_sesion';
export const SESION_HORAS = 8;

export const LIMITE_FOTO_MB = LIMITES.FOTO_MB;

export const CAMPOS_FOTO = Object.freeze(['anverso', 'reverso', 'etiqueta']);
