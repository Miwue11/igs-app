import { ESTADOS_PEDIDO, SIGUIENTE_ESTADO } from '../constantes/estados.js';
import { esUrgente } from './plazos.js';

const tiempo = (fecha) => (fecha ? new Date(fecha).getTime() : Number.POSITIVE_INFINITY);
const haLlegado = (pedido) => Boolean(pedido.fechaLlegada);
const prioridad = (pedido) => pedido.servicio?.prioridad ?? 0;

const porFecha = (campo) => (a, b) => tiempo(a[campo]) - tiempo(b[campo]);

/** Entre urgentes manda la fecha límite; entre no urgentes, la prioridad del servicio. */
const porUrgenciaYPrioridad = (ahora) => (a, b) => {
  const urgenteA = esUrgente(a, ahora);
  const urgenteB = esUrgente(b, ahora);
  if (urgenteA !== urgenteB) return Number(urgenteB) - Number(urgenteA);
  return urgenteA ? porFecha('fechaLimite')(a, b) : prioridad(b) - prioridad(a);
};

/**
 * Orden de la cola de trabajo:
 *   1. Primero los pedidos cuyo paquete ya ha llegado.
 *   2. Los urgentes (vencen en 3 días o menos, o ya están fuera de plazo), por fecha límite.
 *      Así se cumplen los 14 días del Gradeo Estándar aunque haya pedidos con más prioridad.
 *   3. El resto, por prioridad del servicio (Premium > Express > Estándar).
 *   4. Después, fecha límite más cercana, orden de llegada (FIFO) y fecha de creación.
 */
export const ordenarCola = (pedidos, ahora) =>
  [...pedidos].sort((a, b) =>
    Number(haLlegado(b)) - Number(haLlegado(a))
    || porUrgenciaYPrioridad(ahora)(a, b)
    || porFecha('fechaLimite')(a, b)
    || porFecha('fechaLlegada')(a, b)
    || porFecha('creadoEn')(a, b));

export const siguienteEstado = (estado) => SIGUIENTE_ESTADO[estado] ?? null;

/** Texto del botón que avanza el pedido en el panel. */
export const ACCION_ESTADO = Object.freeze({
  [ESTADOS_PEDIDO.PENDIENTE_ENVIO]: 'Marcar recibido',
  [ESTADOS_PEDIDO.RECIBIDO]: 'Empezar gradeo',
  [ESTADOS_PEDIDO.EN_GRADEO]: 'Publicar gradeo',
  [ESTADOS_PEDIDO.COMPLETADO]: 'Marcar enviado de vuelta',
});
