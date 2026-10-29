import mongoose from 'mongoose';
import { COLECCIONES, MARCAS_TIEMPO } from '../constantes/colecciones.js';
import { ESTADOS_TICKET, IDS_TIPO_TICKET, LIMITES } from '../../../compartido/index.js';
import { limpiarJSON } from './complementos/limpiarJSON.js';

const { ObjectId } = mongoose.Schema.Types;

const esquemaRespuesta = new mongoose.Schema(
  {
    autor: { type: ObjectId, ref: 'Usuario' },
    mensaje: { type: String, required: true, maxlength: LIMITES.MENSAJE_MAX },
    fecha: { type: Date, default: Date.now },
  },
  { _id: false },
);

/** Ticket de ayuda. Puede abrirlo un visitante (sin cuenta) o un cliente registrado. */
const esquemaTicket = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true },
    usuario: { type: ObjectId, ref: 'Usuario', default: null },
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    tipo: { type: String, enum: IDS_TIPO_TICKET, required: true },
    referencia: { type: String, default: '' },
    mensaje: { type: String, required: true, maxlength: LIMITES.MENSAJE_MAX },
    estado: { type: String, enum: Object.values(ESTADOS_TICKET), default: ESTADOS_TICKET.ABIERTO },
    respuestas: { type: [esquemaRespuesta], default: [] },
  },
  { timestamps: MARCAS_TIEMPO },
);

esquemaTicket.index({ estado: 1, creadoEn: -1 });
esquemaTicket.plugin(limpiarJSON);

export const Ticket = mongoose.model('Ticket', esquemaTicket, COLECCIONES.TICKETS);
