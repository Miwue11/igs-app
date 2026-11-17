/** Formatos y límites comunes a cliente y servidor. */
export const PREFIJO_CERTIFICADO = 'IGS';
export const PREFIJO_PEDIDO = 'PED';
export const PREFIJO_TICKET = 'TCK';

export const REGEX = Object.freeze({
  ID_CERTIFICADO: /^IGS-\d{4}-\d{6}$/,
  PEDIDO: /^PED-\d{4,}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
});

export const LIMITES = Object.freeze({
  CONTRASENA_MIN: 8,
  NOMBRE_MAX: 80,
  MENSAJE_MAX: 2000,
  UNIDADES_MIN: 1,
  UNIDADES_MAX: 1000,
  NOTA_MIN: 1,
  NOTA_MAX: 10,
  NOTA_PASO: 0.5,
  ANIO_MIN: 1900,
  EXPANSION_MAX: 80,
  FOTO_MB: 10,
});
