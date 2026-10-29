import { Router } from 'express';
import { ROLES_INTERNOS } from '../../../compartido/index.js';
import * as ia from '../controladores/ia.controlador.js';
import { autenticar, permitir } from '../middlewares/autenticacion.js';
import { subirEtiquetaEnMemoria } from '../middlewares/subida.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';

export const rutasIA = Router()
  .post('/etiqueta', autenticar, permitir(...ROLES_INTERNOS), subirEtiquetaEnMemoria, a(ia.etiqueta));
