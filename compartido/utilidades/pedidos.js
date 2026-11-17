import { PRIORIDADES } from '../constantes/plazos.js';
import { ESTADOS_PEDIDO, SIGUIENTE_ESTADO } from '../constantes/estados.js';
import { ENVIO_VUELTA_EUR, ESTADOS_ARTICULO } from '../constantes/negocio.js';
import { LIMITES } from '../constantes/formatos.js';
import { ORIGENES_IMAGENES_CARTAS } from '../constantes/apisCartas.js';
import { calcularFechaLimite } from './plazos.js';

/**
 * Copia del servicio que se guarda dentro del pedido. Así el precio, el plazo, la prioridad y
 * el valor máximo no cambian para ese pedido aunque luego cambie el catálogo.
 */
export const copiaServicio = ({
  codigo, nombre, precio, plazoDias, prioridad = PRIORIDADES.NORMAL, valorMax = null, minimoUnidades = 1,
}) => ({ codigo, nombre, precio, plazoDias, prioridad, valorMax, minimoUnidades });

const texto = (v) => (v == null ? '' : String(v).trim());
const numero = (v) => (v === '' || v == null ? null : Number(v));

/** Solo se guarda la imagen oficial si viene de una de las APIs de cartas (evita enlaces arbitrarios). */
export const imagenOficialValida = (url) =>
  typeof url === 'string' && ORIGENES_IMAGENES_CARTAS.some((origen) => url.startsWith(`${origen}/`)) ? url : null;

/** Limpia la lista de artículos que declara el cliente y los deja pendientes de gradeo. */
export const prepararArticulos = (articulos = []) =>
  articulos.map((a) => ({
    nombre: texto(a.nombre),
    marca: texto(a.marca),
    expansion: texto(a.expansion),
    anio: numero(a.anio),
    numero: texto(a.numero),
    idioma: texto(a.idioma),
    rareza: texto(a.rareza),
    imagen: imagenOficialValida(a.imagen),
    valorDeclarado: Number(a.valorDeclarado),
    estado: ESTADOS_ARTICULO.PENDIENTE,
    idCertificado: null,
    motivo: '',
  }));

/**
 * Comprueba los artículos frente al servicio elegido (como el «declared value» de PSA):
 * mínimo de unidades del servicio y valor declarado máximo por artículo.
 * Devuelve el mensaje de error o null.
 */
export const errorArticulosServicio = (servicio, articulos) => {
  const minimo = servicio.minimoUnidades ?? 1;
  if (articulos.length < minimo) return `Este servicio requiere al menos ${minimo} artículos.`;
  if (articulos.length > LIMITES.UNIDADES_MAX) return `Un pedido admite como máximo ${LIMITES.UNIDADES_MAX} artículos.`;
  if (servicio.valorMax != null) {
    const caro = articulos.find((a) => Number(a.valorDeclarado) > servicio.valorMax);
    if (caro) {
      return `«${caro.nombre}» supera el valor declarado máximo de este servicio (${servicio.valorMax} €). Elige un servicio superior.`;
    }
  }
  return null;
};

const redondear = (n) => Math.round(n * 100) / 100;

/** Importe del pedido: gradeo por artículo + envío de vuelta asegurado. null si el servicio es «a consultar». */
export const importePedido = (servicio, articulos = []) => {
  const valorDeclarado = redondear(articulos.reduce((t, a) => t + (Number(a.valorDeclarado) || 0), 0));
  if (servicio.precio == null) return { gradeo: null, envio: ENVIO_VUELTA_EUR, total: null, valorDeclarado };
  const gradeo = redondear(servicio.precio * articulos.length);
  return { gradeo, envio: ENVIO_VUELTA_EUR, total: redondear(gradeo + ENVIO_VUELTA_EUR), valorDeclarado };
};

/** Datos de un pedido nuevo. El plazo todavía no corre: empieza cuando llega el paquete. */
export const pedidoNuevo = (servicio, articulos, creadoEn = new Date().toISOString()) => ({
  servicio: copiaServicio(servicio),
  articulos,
  unidades: articulos.length,
  importe: importePedido(servicio, articulos),
  creadoEn,
  fechaLlegada: null,
  fechaLimite: null,
  fechaPublicacion: null,
});

export const articulosPendientes = (pedido) =>
  (pedido.articulos ?? []).filter((a) => a.estado === ESTADOS_ARTICULO.PENDIENTE);

/** Resumen para tablas: «3/12 resueltos». */
export const resumenArticulos = (pedido) => {
  const total = pedido.articulos?.length ?? pedido.unidades ?? 0;
  return { total, resueltos: total - articulosPendientes(pedido).length };
};

/**
 * Comprueba un cambio de estado. Solo se avanza un paso cada vez y no se puede publicar
 * mientras queden artículos sin resolver. Devuelve el mensaje de error o null.
 */
export const errorCambioEstado = (pedido, nuevo) => {
  if (SIGUIENTE_ESTADO[pedido.estado] !== nuevo) return 'El pedido solo puede avanzar al siguiente estado.';
  if (nuevo === ESTADOS_PEDIDO.COMPLETADO) {
    const pendientes = articulosPendientes(pedido).length;
    if (pendientes > 0) return `Quedan ${pendientes} artículos sin gradear ni marcar como no gradeables.`;
  }
  return null;
};

/** Aplica el cambio de estado: al recibir el paquete empieza a contar el plazo; al completar se publica. */
export const aplicarCambioEstado = (pedido, nuevo, fecha = new Date().toISOString()) => {
  pedido.estado = nuevo;
  if (nuevo === ESTADOS_PEDIDO.RECIBIDO && !pedido.fechaLlegada) {
    pedido.fechaLlegada = fecha;
    pedido.fechaLimite = calcularFechaLimite(fecha, pedido.servicio.plazoDias);
  }
  if (nuevo === ESTADOS_PEDIDO.COMPLETADO && !pedido.fechaPublicacion) pedido.fechaPublicacion = fecha;
  return pedido;
};

/** Comprueba que un artículo se puede resolver (gradear o marcar no gradeable). Devuelve el error o null. */
export const errorResolverArticulo = (pedido, indice) => {
  if (pedido.estado !== ESTADOS_PEDIDO.EN_GRADEO) return 'Solo se gradean artículos de pedidos «En gradeo».';
  const articulo = pedido.articulos?.[indice];
  if (!articulo) return 'Ese artículo no existe en el pedido.';
  if (articulo.estado !== ESTADOS_ARTICULO.PENDIENTE) return 'Ese artículo ya está resuelto.';
  return null;
};
