import { Router } from 'express';
import * as catalogo from '../controladores/cartasCatalogo.controlador.js';
import { limitarIntentos } from '../middlewares/limitarIntentos.js';
import { manejadorAsync as a } from '../utilidades/manejadorAsync.js';

/** Buscador de cartas: público pero limitado, para no agotar las APIs gratuitas de terceros. */
export const rutasCartasCatalogo = Router()
  .get('/juegos', a(catalogo.juegos))
  .get('/cartas', limitarIntentos({ maximo: 60, ventanaMs: 60_000 }), a(catalogo.cartas));
