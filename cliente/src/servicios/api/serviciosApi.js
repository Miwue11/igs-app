import { peticion } from '../http.js';

export const serviciosApi = {
  listar: () => peticion('/servicios'),
};
