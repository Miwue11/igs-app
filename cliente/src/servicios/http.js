import { CONFIGURACION } from '../constantes/configuracion.js';

/** Error devuelto por la API: status HTTP, mensaje para el usuario y errores por campo. */
export class ErrorApi extends Error {
  constructor(status, mensaje, detalles = null) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

const SIN_CONEXION = 'No hay conexión con el servidor. Inténtalo de nuevo.';

const opcionesDe = ({ metodo = 'GET', datos, formulario }) => {
  const opciones = { method: metodo, credentials: 'include', headers: {} };
  if (formulario) opciones.body = formulario;
  else if (datos !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(datos);
  }
  return opciones;
};

const leerCuerpo = (respuesta) => (respuesta.status === 204 ? null : respuesta.json().catch(() => null));

/** Única función que habla con el servidor. Todas las llamadas a la API pasan por aquí. */
export const peticion = async (ruta, opciones = {}) => {
  let respuesta;
  try {
    respuesta = await fetch(`${CONFIGURACION.URL_API}${ruta}`, opcionesDe(opciones));
  } catch {
    throw new ErrorApi(0, SIN_CONEXION);
  }
  const cuerpo = await leerCuerpo(respuesta);
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, cuerpo?.error ?? 'Error inesperado.', cuerpo?.detalles);
  return cuerpo;
};

/** Junta datos JSON y archivos en un FormData (para subir fotos). */
export const formularioConArchivos = (datos, archivos = {}) => {
  const formulario = new FormData();
  if (datos) formulario.append('datos', JSON.stringify(datos));
  Object.entries(archivos).forEach(([campo, archivo]) => archivo && formulario.append(campo, archivo));
  return formulario;
};
