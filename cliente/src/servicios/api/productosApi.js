import { peticion, formularioConArchivos } from '../http.js';

export const productosApi = {
  consultar: (idCertificado) => peticion(`/productos/${encodeURIComponent(idCertificado)}`),
  verificarUV: (idCertificado, codigo) =>
    peticion(`/productos/${encodeURIComponent(idCertificado)}/verificar-uv`, { metodo: 'POST', datos: { codigo } }),
  codigoUV: (idCertificado) => peticion(`/productos/${encodeURIComponent(idCertificado)}/codigo-uv`),
  crear: (datos, fotos) => peticion('/productos', { metodo: 'POST', formulario: formularioConArchivos(datos, fotos) }),
};
