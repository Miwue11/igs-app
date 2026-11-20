import { HTTP } from '../constantes/http.js';
import { crearTicket, listarTickets, cambiarEstadoTicket, responderTicket } from '../servicios/tickets.servicio.js';

export const crear = async (req, res) =>
  res.status(HTTP.CREADO).json(await crearTicket(req.body, req.usuario?._id ?? null));

export const listar = async (req, res) => res.json(await listarTickets(req.query.estado));

export const cambiarEstado = async (req, res) =>
  res.json(await cambiarEstadoTicket(req.params.codigo, req.body.estado));

export const responder = async (req, res) =>
  res.status(HTTP.CREADO).json(await responderTicket(req.params.codigo, req.body.mensaje, req.usuario));
