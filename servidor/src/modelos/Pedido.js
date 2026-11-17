import mongoose from 'mongoose';
import { COLECCIONES, MARCAS_TIEMPO } from '../constantes/colecciones.js';
import { ESTADOS_PEDIDO, ESTADOS_ARTICULO, LIMITES } from '../../../compartido/index.js';
import { limpiarJSON } from './complementos/limpiarJSON.js';

const { ObjectId } = mongoose.Schema.Types;

/** Copia del servicio en el momento del pedido (precio, plazo y prioridad no cambian aunque cambie el catálogo). */
const esquemaServicioPedido = new mongoose.Schema(
  {
    codigo: String, nombre: String, precio: Number, plazoDias: Number, prioridad: Number,
    valorMax: { type: Number, default: null }, minimoUnidades: { type: Number, default: 1 },
  },
  { _id: false },
);

/** Artículo que el cliente declara al hacer el pedido (como el formulario de envío de PSA o BGS). */
const esquemaArticulo = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    marca: { type: String, default: '' },
    expansion: { type: String, default: '' },
    anio: { type: Number, default: null },
    numero: { type: String, default: '' },
    idioma: { type: String, default: '' },
    rareza: { type: String, default: '' },
    // Imagen oficial de la carta (TCGdex o Scryfall) que eligió el cliente en el buscador.
    imagen: { type: String, default: null },
    valorDeclarado: { type: Number, required: true, min: 0 },
    estado: { type: String, enum: Object.values(ESTADOS_ARTICULO), default: ESTADOS_ARTICULO.PENDIENTE },
    idCertificado: { type: String, default: null },
    motivo: { type: String, default: '' },
  },
  { _id: false },
);

const esquemaImporte = new mongoose.Schema(
  { gradeo: Number, envio: Number, total: Number, valorDeclarado: Number },
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
    articulos: { type: [esquemaArticulo], default: [] },
    unidades: { type: Number, required: true, min: LIMITES.UNIDADES_MIN, max: LIMITES.UNIDADES_MAX },
    importe: { type: esquemaImporte, default: null },
    estado: { type: String, enum: Object.values(ESTADOS_PEDIDO), default: ESTADOS_PEDIDO.PENDIENTE_ENVIO },
    fechaLlegada: { type: Date, default: null },
    // Plazo: empieza al recibir el paquete. fechaLimite = fechaLlegada + plazoDias. fechaPublicacion = al pasar a «Completado».
    fechaLimite: { type: Date, default: null },
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
