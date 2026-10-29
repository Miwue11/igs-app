import { PREFIJO_CERTIFICADO, PREFIJO_PEDIDO, PREFIJO_TICKET, REGEX } from '../constantes/formatos.js';

const rellenar = (numero, cifras) => String(numero).padStart(cifras, '0');

/** IGS-2026-000123 */
export const formatearIdCertificado = (anio, secuencia) =>
  `${PREFIJO_CERTIFICADO}-${anio}-${rellenar(secuencia, 6)}`;

/** PED-0042 */
export const formatearPedido = (secuencia) => `${PREFIJO_PEDIDO}-${rellenar(secuencia, 4)}`;

/** TCK-0007 */
export const formatearTicket = (secuencia) => `${PREFIJO_TICKET}-${rellenar(secuencia, 4)}`;

/** Limpia lo que escribe el usuario: espacios y minúsculas. */
export const normalizarIdCertificado = (texto = '') => texto.trim().toUpperCase();

export const esIdCertificado = (texto) => REGEX.ID_CERTIFICADO.test(normalizarIdCertificado(texto));

/** Nombre del contador de certificados de un año (colección counters). */
export const contadorCertificado = (anio) => `cert-${anio}`;
