import mongoose from 'mongoose';
import { COLECCIONES, MARCAS_TIEMPO } from '../constantes/colecciones.js';

/**
 * Carta del catálogo de CardTrader (un «blueprint»: una impresión concreta de una carta).
 * Se sincroniza con `npm run catalogo` porque la API de CardTrader no permite buscar por nombre.
 */
const esquemaCartaCatalogo = new mongoose.Schema(
  {
    fuente: { type: String, required: true, default: 'cardtrader' },
    idExterno: { type: Number, required: true },
    juegoId: { type: Number, required: true },
    juego: { type: String, required: true, trim: true },
    expansionId: { type: Number },
    expansion: { type: String, default: '', trim: true },
    codigoExpansion: { type: String, default: '', trim: true },
    nombre: { type: String, required: true, trim: true },
    // Nombre en minúsculas, sin tildes ni signos: es por lo que se busca.
    nombreBusqueda: { type: String, required: true },
    version: { type: String, default: '' },
    numero: { type: String, default: '' },
    rareza: { type: String, default: '' },
    imagen: { type: String, default: null },
  },
  { timestamps: MARCAS_TIEMPO, versionKey: false },
);

esquemaCartaCatalogo.index({ fuente: 1, idExterno: 1 }, { unique: true });
esquemaCartaCatalogo.index({ juegoId: 1, nombreBusqueda: 1 });

export const CartaCatalogo = mongoose.model('CartaCatalogo', esquemaCartaCatalogo, COLECCIONES.CATALOGO_CARTAS);
