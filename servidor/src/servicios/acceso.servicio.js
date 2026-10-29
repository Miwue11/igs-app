import bcrypt from 'bcryptjs';
import { Usuario } from '../modelos/index.js';
import { conflicto, noAutenticado } from '../utilidades/errorHttp.js';

const RONDAS_HASH = 10;
const CREDENCIALES_INCORRECTAS = 'Email o contraseña incorrectos.';

export const registrar = async ({ nombre, email, contrasena }) => {
  if (await Usuario.exists({ email: email.toLowerCase() })) {
    throw conflicto('Ya existe una cuenta con ese email.');
  }
  const hashContrasena = await bcrypt.hash(contrasena, RONDAS_HASH);
  return Usuario.create({ nombre, email, hashContrasena });
};

export const iniciarSesion = async ({ email, contrasena }) => {
  const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select('+hashContrasena');
  const valido = usuario?.activo && (await bcrypt.compare(contrasena, usuario.hashContrasena));
  if (!valido) throw noAutenticado(CREDENCIALES_INCORRECTAS);
  return usuario;
};

export const cifrarContrasena = (contrasena) => bcrypt.hash(contrasena, RONDAS_HASH);
