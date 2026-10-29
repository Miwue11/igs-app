/** Copia solo las claves permitidas de un objeto. */
export const elegir = (objeto = {}, claves = []) =>
  Object.fromEntries(claves.filter((clave) => objeto[clave] !== undefined).map((clave) => [clave, objeto[clave]]));
