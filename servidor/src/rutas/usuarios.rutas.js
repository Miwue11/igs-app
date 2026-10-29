import { Router } from 'express';
import { ROLES } from '../../../compartido/index.js';
import * as usuarios from '../controladores/usuarios.controlador.js';
import { autenticar, permitir } from '../middlewares/autenticacion.js';
import { validarCuerpo } from '../middlewares/validar.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';

export const rutasUsuarios = Router()
  .use(autenticar, permitir(ROLES.ADMIN))
  .get('/', a(usuarios.listar))
  .patch('/:id/rol', validarCuerpo('rol'), a(usuarios.actualizarRol));
