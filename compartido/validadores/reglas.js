import { MENSAJES } from '../constantes/mensajes.js';
import { LIMITES, REGEX } from '../constantes/formatos.js';
import { VALOR_DECLARADO_MAX } from '../constantes/negocio.js';
import { esNotaValida } from '../utilidades/grados.js';
import { esIdCertificado } from '../utilidades/ids.js';
import { esCodigoUVConFormato } from '../utilidades/codigoUV.js';

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

/** Año de publicación: entre 1900 y el año actual + 1 (preventas). */
export const anio = (v) => entero(LIMITES.ANIO_MIN, new Date().getFullYear() + 1, MENSAJES.ANIO)(v);

export const nota = (v) => (vacio(v) || esNotaValida(v) ? null : MENSAJES.NOTA);

export const codigoUV = (v) => (vacio(v) || esCodigoUVConFormato(v) ? null : MENSAJES.CODIGO_UV);

export const idCertificado = (v) => (vacio(v) || esIdCertificado(v) ? null : MENSAJES.ID_CERTIFICADO);

/** Lista de artículos declarados: al menos uno, cada uno con nombre y un valor declarado válido. */
export const articulosDeclarados = (lista) => {
  if (!Array.isArray(lista) || lista.length === 0) return MENSAJES.SIN_ARTICULOS;
  if (lista.length > LIMITES.UNIDADES_MAX) return MENSAJES.UNIDADES;
  const posicion = lista.findIndex((a) => {
    const valor = Number(a?.valorDeclarado);
    return vacio(a?.nombre) || String(a.nombre).length > 120
      || vacio(a?.valorDeclarado) || !Number.isFinite(valor) || valor <= 0 || valor > VALOR_DECLARADO_MAX
      || (!vacio(a?.anio) && anio(a.anio));
  });
  return posicion === -1 ? null : `${MENSAJES.ARTICULO_INCOMPLETO} (artículo ${posicion + 1})`;
};

const leer = (datos, ruta) => ruta.split('.').reduce((obj, clave) => obj?.[clave], datos);

/** Aplica un esquema { campo: [reglas] } y devuelve { campo: mensaje }. */
export const validar = (esquema, datos = {}) =>
  Object.entries(esquema).reduce((errores, [campo, reglas]) => {
    const valor = leer(datos, campo);
    const error = reglas.map((regla) => regla(valor, datos)).find(Boolean);
    return error ? { ...errores, [campo]: error } : errores;
  }, {});

export const sinErrores = (errores) => Object.keys(errores).length === 0;
