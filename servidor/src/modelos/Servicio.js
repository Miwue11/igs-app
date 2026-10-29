import mongoose from 'mongoose';
import { COLECCIONES, MARCAS_TIEMPO } from '../constantes/colecciones.js';
import { IDS_CATEGORIA, PLAZO_BASICO_DIAS, PRIORIDADES } from '../../../compartido/index.js';
import { limpiarJSON } from './complementos/limpiarJSON.js';

/**
 * Servicio de gradeo que se ofrece al cliente. `null` en valor/precio = "sin límite" / "a consultar".
 * plazoDias: días máximos desde que se crea el pedido hasta que se publica (el básico, 14).
 * prioridad: preferencia en la cola (0 normal, 1 alta, 2 máxima).
 */
const esquemaServicio = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    categoria: { type: String, enum: IDS_CATEGORIA, required: true },
    descripcion: { type: String, default: '' },
    plazoDias: { type: Number, required: true, min: 1, default: PLAZO_BASICO_DIAS },
    prioridad: { type: Number, enum: Object.values(PRIORIDADES), default: PRIORIDADES.NORMAL },
    extras: { type: [String], default: [] },
    valorMax: { type: Number, default: null },
    precio: { type: Number, default: null },
    destacado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: MARCAS_TIEMPO },
);

esquemaServicio.plugin(limpiarJSON);

export const Servicio = mongoose.model('Servicio', esquemaServicio, COLECCIONES.SERVICIOS);
