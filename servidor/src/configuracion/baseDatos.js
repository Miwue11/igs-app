import mongoose from 'mongoose';
import { ENTORNO } from './entorno.js';

/** Abre la conexión con MongoDB. */
export const conectarBaseDatos = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(ENTORNO.URI_MONGODB);
  console.log(`[igs] MongoDB conectado: ${mongoose.connection.name}`);
};

export const desconectarBaseDatos = () => mongoose.disconnect();
