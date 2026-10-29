import { Pedido } from '../modelos/index.js';
import {
  ESTADOS_PEDIDO, ESTADOS_EN_COLA, formatearPedido, ordenarCola, copiaServicio, plazoDePedidoNuevo,
} from '../../../compartido/index.js';
import { siguienteNumero } from './contador.servicio.js';
import { buscarServicio } from './catalogo.servicio.js';
import { noEncontrado, peticionIncorrecta } from '../utilidades/errorHttp.js';

const CAMPOS_CLIENTE = 'nombre email';

export const crearPedido = async (clienteId, { servicio, unidades, notas = '' }) => {
  const elegido = await buscarServicio(servicio);
  if (!elegido) throw peticionIncorrecta('El servicio elegido no existe.');

  const codigo = formatearPedido(await siguienteNumero('pedido'));
  return Pedido.create({
    codigo,
    cliente: clienteId,
    servicio: copiaServicio(elegido),
    ...plazoDePedidoNuevo(elegido),
    unidades: Number(unidades),
    notas,
    historial: [{ estado: ESTADOS_PEDIDO.PENDIENTE_ENVIO, usuario: clienteId }],
  });
};

export const pedidosDeCliente = (clienteId) => Pedido.find({ cliente: clienteId }).sort({ creadoEn: -1 });

/** Cola de trabajo ordenada por urgencia del plazo, prioridad del servicio y llegada. */
export const colaDePedidos = async (estado) => {
  const estados = estado ? [estado] : ESTADOS_EN_COLA;
  const pedidos = await Pedido.find({ estado: { $in: estados } }).populate('cliente', CAMPOS_CLIENTE);
  return ordenarCola(pedidos.map((p) => p.toJSON()));
};

export const buscarPedido = async (codigo) => {
  const pedido = await Pedido.findOne({ codigo });
  if (!pedido) throw noEncontrado('No existe ese pedido.');
  return pedido;
};

export const cambiarEstadoPedido = async (codigo, estado, usuarioId) => {
  const pedido = await buscarPedido(codigo);
  pedido.estado = estado;
  if (estado === ESTADOS_PEDIDO.RECIBIDO && !pedido.fechaLlegada) pedido.fechaLlegada = new Date();
  if (estado === ESTADOS_PEDIDO.COMPLETADO && !pedido.fechaPublicacion) pedido.fechaPublicacion = new Date();
  pedido.historial.push({ estado, usuario: usuarioId });
  await pedido.save();
  return pedido.populate('cliente', CAMPOS_CLIENTE);
};
