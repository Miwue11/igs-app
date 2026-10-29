import { Servicio } from '../modelos/index.js';

export const listarServicios = () => Servicio.find({ activo: true }).sort({ orden: 1 });

export const buscarServicio = (codigo) => Servicio.findOne({ codigo, activo: true });
