import { ETIQUETAS_PRIORIDAD, PRIORIDADES } from '@compartido';

/** Pastilla con la prioridad del servicio en la cola. */
export function Prioridad({ valor = PRIORIDADES.NORMAL }) {
  return <span className={`pastilla pastilla--prioridad-${valor}`}>{ETIQUETAS_PRIORIDAD[valor]}</span>;
}
