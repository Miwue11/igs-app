import { listarUsuarios, cambiarRol } from '../servicios/usuarios.servicio.js';

export const listar = async (_req, res) => res.json(await listarUsuarios());

export const actualizarRol = async (req, res) =>
  res.json(await cambiarRol(req.params.id, req.body.rol, req.usuario._id));
