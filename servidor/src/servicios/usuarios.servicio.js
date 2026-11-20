import { Usuario } from '../modelos/index.js';
import { noEncontrado, prohibido } from '../utilidades/errorHttp.js';

export const listarUsuarios = () => Usuario.find().sort({ creadoEn: -1 });

export const cambiarRol = async (id, rol, adminId) => {
  if (String(id) === String(adminId)) throw prohibido('No puedes cambiar tu propio rol.');
  const usuario = await Usuario.findByIdAndUpdate(id, { rol }, { new: true });
  if (!usuario) throw noEncontrado('No existe ese usuario.');
  return usuario;
};

/** Activa o desactiva una cuenta. Una cuenta desactivada no puede iniciar sesión ni usar su cookie. */
export const cambiarActivo = async (id, activo, adminId) => {
  if (String(id) === String(adminId)) throw prohibido('No puedes desactivar tu propia cuenta.');
  const usuario = await Usuario.findByIdAndUpdate(id, { activo }, { new: true });
  if (!usuario) throw noEncontrado('No existe ese usuario.');
  return usuario;
};
