import { ETIQUETAS_ESTADO_PEDIDO, ETIQUETAS_ESTADO_TICKET } from '@compartido';

const ETIQUETAS = { ...ETIQUETAS_ESTADO_PEDIDO, ...ETIQUETAS_ESTADO_TICKET };

/** Pastilla de color con el estado de un pedido o de un ticket. */
export function Estado({ valor }) {
  return <span className={`pastilla pastilla--${valor}`}>{ETIQUETAS[valor] ?? valor}</span>;
}
