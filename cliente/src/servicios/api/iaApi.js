import { peticion, formularioConArchivos } from '../http.js';

export const iaApi = {
  leerEtiqueta: (foto) =>
    peticion('/ia/etiqueta', { metodo: 'POST', formulario: formularioConArchivos(null, { etiqueta: foto }) })
      .then((r) => r.campos),
};
