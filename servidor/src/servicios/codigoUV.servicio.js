import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { ENTORNO } from '../configuracion/entorno.js';
import { codigoUVDesdeBytes, mensajeCodigoUV, normalizarCodigoUV } from '../../../compartido/index.js';

/** Clave secreta: CLAVE_UV o, si no existe, una derivada de SECRETO_JWT (nunca sale del servidor). */
const clave = () =>
  ENTORNO.CLAVE_UV || createHash('sha256').update(`igs-uv|${ENTORNO.SECRETO_JWT || 'desarrollo'}`).digest();

/** Código UV que se imprime en el slab de ese certificado. */
export const codigoUV = (idCertificado) =>
  codigoUVDesdeBytes(createHmac('sha256', clave()).update(mensajeCodigoUV(idCertificado)).digest());

/** Comprueba el código que ve el comprador con la lámpara UV (comparación en tiempo constante). */
export const codigoUVCorrecto = (idCertificado, texto) => {
  const esperado = Buffer.from(codigoUV(idCertificado));
  const recibido = Buffer.from(normalizarCodigoUV(texto));
  return esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
};
