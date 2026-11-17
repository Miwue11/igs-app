import {
  DIAS_AVISO_PLAZO, ESTADOS_PLAZO, PRIORIDADES, ETIQUETAS_PRIORIDAD,
} from '../constantes/plazos.js';

const DIA_MS = 24 * 60 * 60 * 1000;
const fecha = (valor) => new Date(valor ?? Date.now());

/** Fecha límite de publicación: fecha de llegada del paquete + días del servicio. */
export const calcularFechaLimite = (creadoEn, plazoDias) =>
  new Date(fecha(creadoEn).getTime() + plazoDias * DIA_MS).toISOString();

/** Días que faltan (negativo si ya pasó). Se redondea hacia arriba: 1 h restante = 1 día. */
export const diasRestantes = (fechaLimite, ahora) => Math.ceil((fecha(fechaLimite) - fecha(ahora)) / DIA_MS);

/** Situación del pedido respecto a su plazo. */
export const estadoPlazo = ({ fechaLimite, fechaPublicacion }, ahora) => {
  if (!fechaLimite) return ESTADOS_PLAZO.SIN_INICIAR;
  if (fechaPublicacion) {
    return fecha(fechaPublicacion) <= fecha(fechaLimite) ? ESTADOS_PLAZO.CUMPLIDO : ESTADOS_PLAZO.CUMPLIDO_TARDE;
  }
  if (fecha(fechaLimite) < fecha(ahora)) return ESTADOS_PLAZO.VENCIDO;
  return diasRestantes(fechaLimite, ahora) <= DIAS_AVISO_PLAZO ? ESTADOS_PLAZO.PROXIMO : ESTADOS_PLAZO.EN_PLAZO;
};

/** Un pedido es urgente si vence pronto o ya está fuera de plazo y aún no se ha publicado. */
export const esUrgente = (pedido, ahora) =>
  [ESTADOS_PLAZO.PROXIMO, ESTADOS_PLAZO.VENCIDO].includes(estadoPlazo(pedido, ahora));

/** Ventajas que se muestran en la tarjeta de cada servicio. */
export const ventajasServicio = ({ plazoDias, prioridad = PRIORIDADES.NORMAL, extras = [] }) => [
  `Publicado en ${plazoDias} días como máximo desde que recibimos el paquete`,
  ...(prioridad > PRIORIDADES.NORMAL ? [`Prioridad ${ETIQUETAS_PRIORIDAD[prioridad].toLowerCase()} en la cola`] : []),
  ...extras,
];
