import { HTTP } from '../constantes/http.js';
import { consultarProducto, crearProducto, productosDePedido } from '../servicios/productos.servicio.js';

export const consultar = async (req, res) => res.json(await consultarProducto(req.params.idCertificado));

export const crear = async (req, res) =>
  res.status(HTTP.CREADO).json(await crearProducto(req.body, req.files, req.usuario._id));

export const dePedido = async (req, res) => res.json(await productosDePedido(req.params.codigo));
