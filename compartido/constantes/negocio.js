/**
 * Reglas comerciales entre el cliente e IGS (inspiradas en PSA y BGS).
 */

/** Envío de vuelta asegurado por pedido (en euros). */
export const ENVIO_VUELTA_EUR = 15;

/** Valor declarado máximo por artículo que se admite en el formulario (en euros). */
export const VALOR_DECLARADO_MAX = 1_000_000;

/** Estado de cada artículo declarado dentro de un pedido. */
export const ESTADOS_ARTICULO = Object.freeze({
  PENDIENTE: 'pendiente',
  GRADEADO: 'gradeado',
  NO_GRADEABLE: 'no_gradeable',
});

export const ETIQUETAS_ESTADO_ARTICULO = Object.freeze({
  [ESTADOS_ARTICULO.PENDIENTE]: 'Pendiente',
  [ESTADOS_ARTICULO.GRADEADO]: 'Gradeado',
  [ESTADOS_ARTICULO.NO_GRADEABLE]: 'No gradeable',
});

/**
 * Motivos por los que un artículo se devuelve sin encapsular (equivalen a los códigos «N» de PSA).
 * El servicio se cobra igualmente, porque la evaluación se ha hecho.
 */
export const MOTIVOS_NO_GRADEABLE = Object.freeze([
  'Alterada o recortada',
  'Posible falsificación',
  'Tamaño o grosor no estándar',
  'Daño grave que impide encapsularla',
  'No coincide con lo declarado',
]);
