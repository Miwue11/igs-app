import { HTTP } from '../constantes/http.js';

/** Error con código HTTP que el manejador de errores convierte en respuesta JSON. */
export class ErrorHttp extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

export const peticionIncorrecta = (mensaje, detalles) => new ErrorHttp(HTTP.PETICION_INCORRECTA, mensaje, detalles);
export const noAutenticado = (mensaje = 'Inicia sesión para continuar.') => new ErrorHttp(HTTP.NO_AUTENTICADO, mensaje);
export const prohibido = (mensaje = 'No tienes permiso para esta acción.') => new ErrorHttp(HTTP.PROHIBIDO, mensaje);
export const noEncontrado = (mensaje = 'No encontrado.') => new ErrorHttp(HTTP.NO_ENCONTRADO, mensaje);
export const conflicto = (mensaje) => new ErrorHttp(HTTP.CONFLICTO, mensaje);
