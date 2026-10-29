import mongoose from 'mongoose';
import { COLECCIONES, MARCAS_TIEMPO } from '../constantes/colecciones.js';
import { ROLES, LIMITES } from '../../../compartido/index.js';
import { limpiarJSON } from './complementos/limpiarJSON.js';

const esquemaUsuario = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: LIMITES.NOMBRE_MAX },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hashContrasena: { type: String, required: true, select: false },
    rol: { type: String, enum: Object.values(ROLES), default: ROLES.CLIENTE },
    activo: { type: Boolean, default: true },
  },
  { timestamps: MARCAS_TIEMPO },
);

esquemaUsuario.plugin(limpiarJSON);

export const Usuario = mongoose.model('Usuario', esquemaUsuario, COLECCIONES.USUARIOS);
