import { peticion } from '../http.js';

export const accesoApi = {
  yo: () => peticion('/acceso/yo').then((r) => r.usuario),
  entrar: (datos) => peticion('/acceso/entrar', { metodo: 'POST', datos }).then((r) => r.usuario),
  registro: (datos) => peticion('/acceso/registro', { metodo: 'POST', datos }).then((r) => r.usuario),
  salir: () => peticion('/acceso/salir', { metodo: 'POST' }),
};
