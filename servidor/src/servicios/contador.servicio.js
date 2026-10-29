import { Contador } from '../modelos/index.js';

/** Devuelve el siguiente número de una secuencia de forma atómica. */
export const siguienteNumero = async (nombre) => {
  const contador = await Contador.findByIdAndUpdate(
    nombre,
    { $inc: { secuencia: 1 } },
    { new: true, upsert: true },
  );
  return contador.secuencia;
};
