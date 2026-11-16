import mongoose from 'mongoose';
import { COLECCIONES } from '../constantes/colecciones.js';

/**
 * Foto subida guardada dentro de MongoDB (se usa con FOTOS_EN_MONGO=true).
 * En Render el disco se borra en cada reinicio, así que las fotos no pueden ir a una carpeta.
 */
const esquemaFoto = new mongoose.Schema(
  {
    datos: { type: Buffer, required: true },
    tipo: { type: String, required: true },
    tamano: { type: Number, required: true },
  },
  { timestamps: { createdAt: 'creadoEn', updatedAt: false }, versionKey: false },
);

export const Foto = mongoose.model('Foto', esquemaFoto, COLECCIONES.FOTOS);
