import mongoose from 'mongoose';
import { COLECCIONES, MARCAS_TIEMPO } from '../constantes/colecciones.js';
import { IDS_CATEGORIA, LIMITES } from '../../../compartido/index.js';
import { limpiarJSON } from './complementos/limpiarJSON.js';

const { ObjectId } = mongoose.Schema.Types;
const notaOpcional = { type: Number, min: LIMITES.NOTA_MIN, max: LIMITES.NOTA_MAX, default: null };

/** Producto gradeado: es la ficha pública que se consulta por su ID de certificado. */
const esquemaProducto = new mongoose.Schema(
  {
    idCertificado: { type: String, required: true, unique: true },
    pedido: { type: ObjectId, ref: 'Pedido', required: true },
    pedidoCodigo: { type: String, required: true },
    nombre: { type: String, required: true, trim: true },
    nota: { type: Number, required: true, min: LIMITES.NOTA_MIN, max: LIMITES.NOTA_MAX },
    etiquetaGrado: { type: String, required: true },
    subnotas: {
      centrado: notaOpcional,
      esquinas: notaOpcional,
      bordes: notaOpcional,
      superficie: notaOpcional,
    },
    marca: { type: String, required: true, trim: true },
    clase: { type: String, default: '' },
    numeroTarjeta: { type: String, default: '' },
    categoria: { type: String, enum: IDS_CATEGORIA, required: true },
    variedad: { type: String, default: '' },
    idioma: { type: String, default: '' },
    comentario: { type: String, default: '', maxlength: LIMITES.MENSAJE_MAX },
    imagenes: {
      anverso: { type: String, default: null },
      reverso: { type: String, default: null },
      etiqueta: { type: String, default: null },
    },
    gradeadoPor: { type: ObjectId, ref: 'Usuario' },
    fechaGradeo: { type: Date, default: Date.now },
  },
  { timestamps: MARCAS_TIEMPO },
);

esquemaProducto.index({ pedido: 1 });
esquemaProducto.plugin(limpiarJSON);

export const Producto = mongoose.model('Producto', esquemaProducto, COLECCIONES.PRODUCTOS);
