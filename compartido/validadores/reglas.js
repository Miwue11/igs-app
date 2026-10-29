import { MENSAJES } from '../constantes/mensajes.js';
import { REGEX } from '../constantes/formatos.js';
import { esNotaValida } from '../utilidades/grados.js';
import { esIdCertificado } from '../utilidades/ids.js';

/**
 * Reglas pequeñas y reutilizables. Cada regla recibe (valor, datos)
 * y devuelve un mensaje de error o null.
 */
const vacio = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

export const requerido = (v) => (vacio(v) ? MENSAJES.OBLIGATORIO : null);

export const email = (v) => (vacio(v) || REGEX.EMAIL.test(String(v).trim()) ? null : MENSAJES.EMAIL);

export const minimo = (n, mensaje) => (v) => (vacio(v) || String(v).length >= n ? null : mensaje);

export const maximo = (n) => (v) => (vacio(v) || String(v).length <= n ? null : MENSAJES.DEMASIADO_LARGO);

export const igualA = (campo, mensaje) => (v, datos) => (v === datos[campo] ? null : mensaje);

export const aceptado = (v) => (v === true || v === 'on' ? null : MENSAJES.CONDICIONES);

export const enLista = (lista) => (v) => (vacio(v) || lista.includes(v) ? null : MENSAJES.OPCION);

export const entero = (min, max, mensaje) => (v) => {
  if (vacio(v)) return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? null : mensaje;
};

export const nota = (v) => (vacio(v) || esNotaValida(v) ? null : MENSAJES.NOTA);

export const idCertificado = (v) => (vacio(v) || esIdCertificado(v) ? null : MENSAJES.ID_CERTIFICADO);

const leer = (datos, ruta) => ruta.split('.').reduce((obj, clave) => obj?.[clave], datos);

/** Aplica un esquema { campo: [reglas] } y devuelve { campo: mensaje }. */
export const validar = (esquema, datos = {}) =>
  Object.entries(esquema).reduce((errores, [campo, reglas]) => {
    const valor = leer(datos, campo);
    const error = reglas.map((regla) => regla(valor, datos)).find(Boolean);
    return error ? { ...errores, [campo]: error } : errores;
  }, {});

export const sinErrores = (errores) => Object.keys(errores).length === 0;
