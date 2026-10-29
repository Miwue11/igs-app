import { listarServicios } from '../servicios/catalogo.servicio.js';

export const listar = async (_req, res) => res.json(await listarServicios());
