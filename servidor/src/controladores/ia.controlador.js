import { leerEtiqueta } from '../servicios/ia.servicio.js';

export const etiqueta = async (req, res) => res.json({ campos: await leerEtiqueta(req.file) });
