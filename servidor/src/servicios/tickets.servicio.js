import { Ticket } from '../modelos/index.js';
import { ESTADOS_TICKET, formatearTicket } from '../../../compartido/index.js';
import { siguienteNumero } from './contador.servicio.js';
import { noEncontrado } from '../utilidades/errorHttp.js';
import { elegir } from '../utilidades/elegir.js';

const CAMPOS_TICKET = ['nombre', 'email', 'tipo', 'referencia', 'mensaje'];

export const crearTicket = async (datos, usuarioId = null) =>
  Ticket.create({
    ...elegir(datos, CAMPOS_TICKET),
    codigo: formatearTicket(await siguienteNumero('ticket')),
    usuario: usuarioId,
  });

export const listarTickets = (estado) =>
  Ticket.find(estado ? { estado } : {}).sort({ creadoEn: -1 });

export const cambiarEstadoTicket = async (codigo, estado) => {
  const ticket = await Ticket.findOneAndUpdate({ codigo }, { estado }, { new: true });
  if (!ticket) throw noEncontrado('No existe ese ticket.');
  return ticket;
};

/** Añade una respuesta del personal. Un ticket abierto pasa a «en proceso» al responderlo. */
export const responderTicket = async (codigo, mensaje, autor) => {
  const ticket = await Ticket.findOne({ codigo });
  if (!ticket) throw noEncontrado('No existe ese ticket.');
  ticket.respuestas.push({ autor: autor._id, autorNombre: autor.nombre, mensaje: String(mensaje).trim() });
  if (ticket.estado === ESTADOS_TICKET.ABIERTO) ticket.estado = ESTADOS_TICKET.EN_PROCESO;
  return ticket.save();
};
