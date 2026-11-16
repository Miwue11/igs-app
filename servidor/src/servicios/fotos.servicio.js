import mongoose from 'mongoose';
import { ENTORNO } from '../configuracion/entorno.js';
import { Foto } from '../modelos/index.js';

/**
 * Guarda una foto subida y devuelve su ruta pública (/fotos/...).
 * - En disco (por defecto): multer ya la ha escrito en CARPETA_FOTOS.
 * - En MongoDB (FOTOS_EN_MONGO=true): se guarda en la colección «fotos».
 */
export const guardarFoto = async (archivo) => {
  if (!ENTORNO.FOTOS_EN_MONGO) return `/fotos/${archivo.filename}`;
  const foto = await Foto.create({ datos: archivo.buffer, tipo: archivo.mimetype, tamano: archivo.size });
  return `/fotos/${foto._id}`;
};

/** Sirve /fotos/:id desde MongoDB. Si el id no es de MongoDB pasa al siguiente manejador (carpeta en disco). */
export const servirFotoDeMongo = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return next();
  try {
    const foto = await Foto.findById(req.params.id);
    if (!foto) return next();
    res.set({ 'Content-Type': foto.tipo, 'Cache-Control': 'public, max-age=604800, immutable' });
    return res.send(foto.datos);
  } catch (error) {
    return next(error);
  }
};
