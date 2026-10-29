/** Envuelve un controlador async para que sus errores lleguen al manejador de Express. */
export const manejadorAsync = (controlador) => (req, res, next) =>
  Promise.resolve(controlador(req, res, next)).catch(next);
