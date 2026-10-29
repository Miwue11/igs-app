import { ESTADOS_PLAZO, ETIQUETAS_ESTADO_PLAZO, diasRestantes, estadoPlazo } from '@compartido';
import { formatoFecha } from '../../utilidades/formato.js';

/** Texto corto con lo que queda de plazo. */
const detalle = (pedido, estado) => {
  if (estado === ESTADOS_PLAZO.CUMPLIDO || estado === ESTADOS_PLAZO.CUMPLIDO_TARDE) {
    return `Publicado el ${formatoFecha(pedido.fechaPublicacion)}`;
  }
  const dias = diasRestantes(pedido.fechaLimite);
  if (dias < 0) return `Retraso de ${-dias} ${dias === -1 ? 'día' : 'días'}`;
  if (dias === 0) return 'Vence hoy';
  return `Quedan ${dias} ${dias === 1 ? 'día' : 'días'}`;
};

/** Fecha límite de publicación del pedido con su estado (en plazo, vence pronto, fuera de plazo…). */
export function Plazo({ pedido }) {
  const estado = estadoPlazo(pedido);
  return (
    <div className="plazo">
      <span>{formatoFecha(pedido.fechaLimite)}</span>
      <span className={`pastilla pastilla--${estado}`} title={ETIQUETAS_ESTADO_PLAZO[estado]}>{detalle(pedido, estado)}</span>
    </div>
  );
}
