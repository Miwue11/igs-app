import mongoose from 'mongoose';
import { COLECCIONES } from '../constantes/colecciones.js';

/** Contadores atómicos para los códigos legibles (IGS-2026-000001, PED-0001...). */
const esquemaContador = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    secuencia: { type: Number, default: 0 },
  },
  { versionKey: false },
);

export const Contador = mongoose.model('Contador', esquemaContador, COLECCIONES.CONTADORES);
