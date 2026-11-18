/** Ciclo de vida de un pedido de gradeo. */
export const ESTADOS_PEDIDO = Object.freeze({
  PENDIENTE_ENVIO: 'pendiente_envio',
  RECIBIDO: 'recibido',
  EN_GRADEO: 'en_gradeo',
  COMPLETADO: 'completado',
  ENVIADO: 'enviado',
});

export const ETIQUETAS_ESTADO_PEDIDO = Object.freeze({
  [ESTADOS_PEDIDO.PENDIENTE_ENVIO]: 'Esperando tu paquete',
  [ESTADOS_PEDIDO.RECIBIDO]: 'Recibido en IGS',
  [ESTADOS_PEDIDO.EN_GRADEO]: 'En gradeo',
  [ESTADOS_PEDIDO.COMPLETADO]: 'Publicado',
  [ESTADOS_PEDIDO.ENVIADO]: 'Enviado de vuelta',
});

/** Estados que aparecen en la cola de trabajo. */
export const ESTADOS_EN_COLA = Object.freeze([
  ESTADOS_PEDIDO.PENDIENTE_ENVIO,
  ESTADOS_PEDIDO.RECIBIDO,
  ESTADOS_PEDIDO.EN_GRADEO,
]);

/** Estado al que avanza cada pedido desde el panel. */
export const SIGUIENTE_ESTADO = Object.freeze({
  [ESTADOS_PEDIDO.PENDIENTE_ENVIO]: ESTADOS_PEDIDO.RECIBIDO,
  [ESTADOS_PEDIDO.RECIBIDO]: ESTADOS_PEDIDO.EN_GRADEO,
  [ESTADOS_PEDIDO.EN_GRADEO]: ESTADOS_PEDIDO.COMPLETADO,
  [ESTADOS_PEDIDO.COMPLETADO]: ESTADOS_PEDIDO.ENVIADO,
});

export const ESTADOS_TICKET = Object.freeze({
  ABIERTO: 'abierto',
  EN_PROCESO: 'en_proceso',
  CERRADO: 'cerrado',
});

export const ETIQUETAS_ESTADO_TICKET = Object.freeze({
  [ESTADOS_TICKET.ABIERTO]: 'Abierto',
  [ESTADOS_TICKET.EN_PROCESO]: 'En proceso',
  [ESTADOS_TICKET.CERRADO]: 'Cerrado',
});
