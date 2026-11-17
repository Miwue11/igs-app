/**
 * Código UV de cada slab: 8 caracteres impresos con tinta UV invisible en la etiqueta trasera.
 * Se calcula con HMAC-SHA256(clave secreta de IGS, «IGS-UV:» + nº de certificado), así que:
 *   - cada certificado tiene su propio código, y
 *   - sin la clave nadie puede saber qué código le corresponde a un certificado nuevo.
 * Aquí solo está el formato (sin la clave). El cálculo lo hace el servidor (o el modo demo).
 */

/** Alfabeto de Crockford: sin I, L, O ni U para que no se confundan al leerlo con la lámpara. */
const ALFABETO = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const LONGITUD_CODIGO_UV = 8;

export const mensajeCodigoUV = (idCertificado) => `IGS-UV:${idCertificado}`;

/** 40 bits (5 bytes) del HMAC → 8 caracteres, en dos grupos: «7QK2-M9XD». */
export const codigoUVDesdeBytes = (bytes) => {
  let valor = 0n;
  for (let i = 0; i < 5; i += 1) valor = (valor << 8n) | BigInt(bytes[i]);
  let texto = '';
  for (let i = 0; i < LONGITUD_CODIGO_UV; i += 1) {
    texto = ALFABETO[Number(valor & 31n)] + texto;
    valor >>= 5n;
  }
  return `${texto.slice(0, 4)}-${texto.slice(4)}`;
};

/** Normaliza lo que escribe el usuario: mayúsculas, sin espacios ni guiones, O→0 e I/L→1. */
export const normalizarCodigoUV = (texto = '') => {
  const limpio = String(texto).toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
  return limpio.length === LONGITUD_CODIGO_UV ? `${limpio.slice(0, 4)}-${limpio.slice(4)}` : limpio;
};

export const esCodigoUVConFormato = (texto) => /^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/.test(normalizarCodigoUV(texto));
