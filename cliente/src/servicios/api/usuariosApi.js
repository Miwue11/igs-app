import { peticion } from '../http.js';

export const usuariosApi = {
  listar: () => peticion('/usuarios'),
  cambiarRol: (id, rol) => peticion(`/usuarios/${id}/rol`, { metodo: 'PATCH', datos: { rol } }),
};
