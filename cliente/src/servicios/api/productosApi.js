import { peticion, formularioConArchivos } from '../http.js';

export const productosApi = {
  consultar: (idCertificado) => peticion(`/productos/${encodeURIComponent(idCertificado)}`),
  crear: (datos, fotos) => peticion('/productos', { metodo: 'POST', formulario: formularioConArchivos(datos, fotos) }),
};
