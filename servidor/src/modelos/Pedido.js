import mongoose from 'mongoose';
import { COLECCIONES, MARCAS_TIEMPO } from '../constantes/colecciones.js';
import { ESTADOS_PEDIDO, LIMITES } from '../../../compartido/index.js';
import { limpiarJSON } from './complementos/limpiarJSON.js';

const { ObjectId } = mongoose.Schema.Types;

/** Copia del servicio en el momento del pedido (precio, plazo y prioridad no cambian aunque cambie el catálogo). */
const esquemaServicioPedido = new mongoose.Schema(
  { codigo: String, nombre: String, precio: Number, plazoDias: Number, prioridad: Number },
  { _id: false },
);

const esquemaCambioEstado = new mongoose.Schema(
  {
    estado: { type: String, enum: Object.values(ESTADOS_PEDIDO) },
    fecha: { type: Date, default: Date.now },
    usuario: { type: ObjectId, ref: 'Usuario' },
  },
  { _id: false },
);

const esquemaPedido = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true },
    cliente: { type: ObjectId, ref: 'Usuario', required: true },
    servicio: { type: esquemaServicioPedido, required: true },
    unidades: { type: Number, required: true, min: LIMITES.UNIDADES_MIN, max: LIMITES.UNIDADES_MAX },
    estado: { type: String, enum: Object.values(ESTADOS_PEDIDO), default: ESTADOS_PEDIDO.PENDIENTE_ENVIO },
    fechaLlegada: { type: Date, default: null },
    // Plazo: fechaLimite = creadoEn + plazoDias del servicio. fechaPublicacion = cuando pasa a «Completado».
    fechaLimite: { type: Date, required: true },
    fechaPublicacion: { type: Date, default: null },
    notas: { type: String, default: '', maxlength: LIMITES.MENSAJE_MAX },
    historial: { type: [esquemaCambioEstado], default: [] },
  },
  { timestamps: MARCAS_TIEMPO },
);

esquemaPedido.index({ estado: 1, fechaLimite: 1 });
esquemaPedido.index({ cliente: 1, creadoEn: -1 });
esquemaPedido.plugin(limpiarJSON);

export const Pedido = mongoose.model('Pedido', esquemaPedido, COLECCIONES.PEDIDOS);
