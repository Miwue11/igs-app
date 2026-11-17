import { Pedido } from '../modelos/index.js';
import {
  ESTADOS_PEDIDO, ESTADOS_ARTICULO, ESTADOS_EN_COLA, formatearPedido, ordenarCola,
  prepararArticulos, errorArticulosServicio, pedidoNuevo, errorCambioEstado, aplicarCambioEstado, errorResolverArticulo,
} from '../../../compartido/index.js';
import { siguienteNumero } from './contador.servicio.js';
import { buscarServicio } from './catalogo.servicio.js';
import { conflicto, noEncontrado, peticionIncorrecta } from '../utilidades/errorHttp.js';

const CAMPOS_CLIENTE = 'nombre email';

/** Alta de un pedido: el cliente elige servicio y declara cada artículo con su valor. */
export const crearPedido = async (clienteId, { servicio, articulos, notas = '' }) => {
  const elegido = await buscarServicio(servicio);
  if (!elegido) throw peticionIncorrecta('El servicio elegido no existe.');

  const limpios = prepararArticulos(articulos);
  const error = errorArticulosServicio(elegido, limpios);
  if (error) throw peticionIncorrecta(error, { articulos: error });

  const codigo = formatearPedido(await siguienteNumero('pedido'));
  const { creadoEn, ...datos } = pedidoNuevo(elegido, limpios);
  return Pedido.create({
    ...datos,
    codigo,
    cliente: clienteId,
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

/** Avanza el pedido un paso. Al recibirlo empieza el plazo; no se publica con artículos pendientes. */
export const cambiarEstadoPedido = async (codigo, estado, usuarioId) => {
  const pedido = await buscarPedido(codigo);
  const error = errorCambioEstado(pedido, estado);
  if (error) throw conflicto(error);
  aplicarCambioEstado(pedido, estado, new Date());
  pedido.historial.push({ estado, usuario: usuarioId });
  await pedido.save();
  return pedido.populate('cliente', CAMPOS_CLIENTE);
};

/**
 * Reserva un artículo pendiente de forma atómica (dos gradeadores no pueden gradear el mismo).
 * Devuelve el pedido. `cambios` se aplica al artículo.
 */
export const resolverArticulo = async (codigo, indice, cambios) => {
  const pedido = await buscarPedido(codigo);
  const error = errorResolverArticulo(pedido, indice);
  if (error) throw conflicto(error);

  const ruta = `articulos.${indice}`;
  const set = Object.fromEntries(Object.entries(cambios).map(([campo, valor]) => [`${ruta}.${campo}`, valor]));
  const actualizado = await Pedido.findOneAndUpdate(
    { codigo, estado: ESTADOS_PEDIDO.EN_GRADEO, [`${ruta}.estado`]: ESTADOS_ARTICULO.PENDIENTE },
    { $set: set },
    { new: true },
  );
  if (!actualizado) throw conflicto('Ese artículo acaba de resolverlo otra persona.');
  return actualizado;
};

/** Deshace la reserva si algo falla después (p. ej. al guardar las fotos). */
export const liberarArticulo = (codigo, indice) =>
  Pedido.updateOne(
    { codigo },
    { $set: { [`articulos.${indice}.estado`]: ESTADOS_ARTICULO.PENDIENTE, [`articulos.${indice}.idCertificado`]: null } },
  );

/** El artículo no se puede encapsular (alterado, falso…). Se devuelve sin certificado. */
export const marcarNoGradeable = async (codigo, indice, motivo) => {
  const pedido = await resolverArticulo(codigo, indice, { estado: ESTADOS_ARTICULO.NO_GRADEABLE, motivo });
  return pedido.populate('cliente', CAMPOS_CLIENTE);
};
