import { PRIORIDADES } from '../constantes/plazos.js';
import { calcularFechaLimite } from './plazos.js';

/**
 * Copia del servicio que se guarda dentro del pedido. Así el precio, el plazo y la prioridad
 * no cambian para ese pedido aunque luego cambie el catálogo.
 */
export const copiaServicio = ({ codigo, nombre, precio, plazoDias, prioridad = PRIORIDADES.NORMAL }) =>
  ({ codigo, nombre, precio, plazoDias, prioridad });

/** Datos de plazo de un pedido nuevo. */
export const plazoDePedidoNuevo = (servicio, creadoEn = new Date().toISOString()) => ({
  creadoEn,
  fechaLimite: calcularFechaLimite(creadoEn, servicio.plazoDias),
  fechaPublicacion: null,
});
