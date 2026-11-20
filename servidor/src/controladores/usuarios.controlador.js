import { listarUsuarios, cambiarRol, cambiarActivo } from '../servicios/usuarios.servicio.js';

export const listar = async (_req, res) => res.json(await listarUsuarios());

export const actualizarRol = async (req, res) =>
  res.json(await cambiarRol(req.params.id, req.body.rol, req.usuario._id));

export const actualizarActivo = async (req, res) =>
  res.json(await cambiarActivo(req.params.id, req.body.activo, req.usuario._id));
