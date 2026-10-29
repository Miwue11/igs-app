import { CONFIGURACION } from '../constantes/configuracion.js';
import { apiServidor } from './api/index.js';
import { apiDemo } from './demo/apiDemo.js';

/**
 * Punto único de acceso a los datos ("motor" de la aplicación).
 * Los componentes solo usan `api` y no saben si los datos vienen del servidor o de la demo.
 */
export const api = CONFIGURACION.MODO_DEMO ? apiDemo : apiServidor;

export { ErrorApi } from './http.js';
