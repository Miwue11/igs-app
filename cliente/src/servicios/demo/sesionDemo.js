/** Recuerda qué usuario ha entrado en el modo demo mientras la pestaña siga abierta. */
const CLAVE = 'igs-demo-sesion';

export const leerSesion = () => {
  try {
    return sessionStorage.getItem(CLAVE);
  } catch {
    return null;
  }
};

export const guardarSesion = (id) => {
  try {
    if (id) sessionStorage.setItem(CLAVE, id);
    else sessionStorage.removeItem(CLAVE);
  } catch {
    /* sin almacenamiento: la sesión dura hasta recargar */
  }
};
