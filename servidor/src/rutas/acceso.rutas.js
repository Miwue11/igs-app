import { Router } from 'express';
import * as acceso from '../controladores/acceso.controlador.js';
import { autenticar } from '../middlewares/autenticacion.js';
import { validarCuerpo } from '../middlewares/validar.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';

export const rutasAcceso = Router()
  .post('/registro', validarCuerpo('registro'), a(acceso.registro))
  .post('/entrar', validarCuerpo('entrar'), a(acceso.entrar))
  .post('/salir', acceso.salir)
  .get('/yo', autenticar, acceso.yo);
