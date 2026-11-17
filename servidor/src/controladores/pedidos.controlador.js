import { HTTP } from '../constantes/http.js';
import {
  crearPedido, pedidosDeCliente, colaDePedidos, cambiarEstadoPedido, marcarNoGradeable,
} from '../servicios/pedidos.servicio.js';

export const crear = async (req, res) => res.status(HTTP.CREADO).json(await crearPedido(req.usuario._id, req.body));

export const mios = async (req, res) => res.json(await pedidosDeCliente(req.usuario._id));

export const cola = async (req, res) => res.json(await colaDePedidos(req.query.estado));

export const cambiarEstado = async (req, res) =>
  res.json(await cambiarEstadoPedido(req.params.codigo, req.body.estado, req.usuario._id));

export const noGradeable = async (req, res) =>
  res.json(await marcarNoGradeable(req.params.codigo, Number(req.params.indice), req.body.motivo));
