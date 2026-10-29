import { Router } from 'express';
import * as catalogo from '../controladores/catalogo.controlador.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';

export const rutasCatalogo = Router()
  .get('/', a(catalogo.listar));
