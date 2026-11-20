import { ESTADOS_PEDIDO, ETIQUETAS_ESTADO_PEDIDO } from '@compartido';
import { formatoFecha } from '../../utilidades/formato.js';

/** Pasos del pedido en orden, con la fecha en que se alcanzó cada uno (si está en el historial). */
const PASOS = [
  ESTADOS_PEDIDO.PENDIENTE_ENVIO, ESTADOS_PEDIDO.RECIBIDO, ESTADOS_PEDIDO.EN_GRADEO, ESTADOS_PEDIDO.COMPLETADO, ESTADOS_PEDIDO.ENVIADO,
];

const fechaDe = (pedido, estado) => {
  if (estado === ESTADOS_PEDIDO.PENDIENTE_ENVIO) return pedido.creadoEn;
  if (estado === ESTADOS_PEDIDO.RECIBIDO && pedido.fechaLlegada) return pedido.fechaLlegada;
  if (estado === ESTADOS_PEDIDO.COMPLETADO && pedido.fechaPublicacion) return pedido.fechaPublicacion;
  return pedido.historial?.findLast?.((h) => h.estado === estado)?.fecha ?? null;
};

/** Barra de progreso del pedido: Esperando → Recibido → En gradeo → Publicado → Enviado. */
export function SeguimientoPedido({ pedido }) {
  const actual = PASOS.indexOf(pedido.estado);
  return (
    <ol className="seguimiento" aria-label={`Seguimiento del pedido ${pedido.codigo}`}>
      {PASOS.map((estado, i) => {
        const clase = i < actual ? 'hecho' : i === actual ? 'actual' : 'pendiente';
        const fecha = i <= actual ? fechaDe(pedido, estado) : null;
        return (
          <li key={estado} className={`seguimiento-paso ${clase}`} aria-current={i === actual ? 'step' : undefined}>
            <span className="seguimiento-punto" aria-hidden="true" />
            <span className="seguimiento-texto">
              {ETIQUETAS_ESTADO_PEDIDO[estado]}
              {fecha && <small>{formatoFecha(fecha)}</small>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
