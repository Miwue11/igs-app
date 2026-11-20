import { Router } from 'express';
import { rutasAcceso } from './acceso.rutas.js';
import { rutasCatalogo } from './catalogo.rutas.js';
import { rutasPedidos } from './pedidos.rutas.js';
import { rutasProductos } from './productos.rutas.js';
import { rutasTickets } from './tickets.rutas.js';
import { rutasUsuarios } from './usuarios.rutas.js';
import { rutasIA } from './ia.rutas.js';
import { rutasCartasCatalogo } from './cartasCatalogo.rutas.js';

/** Todas las rutas de la API cuelgan de /api. */
export const rutasApi = Router()
  .get('/salud', (_req, res) => res.json({ ok: true }))
  .use('/acceso', rutasAcceso)
  .use('/servicios', rutasCatalogo)
  .use('/pedidos', rutasPedidos)
  .use('/productos', rutasProductos)
  .use('/tickets', rutasTickets)
  .use('/usuarios', rutasUsuarios)
  .use('/ia', rutasIA)
  .use('/catalogo', rutasCartasCatalogo);
