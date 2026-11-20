import { buscarCartas, listarJuegos } from '../servicios/cartasCatalogo.servicio.js';

/** GET /api/catalogo/juegos: juegos del buscador (los fijos y los sincronizados de CardTrader). */
export const juegos = async (_req, res) => res.json(await listarJuegos());

/** GET /api/catalogo/cartas?juego=&q=: cartas que coinciden con el nombre. */
export const cartas = async (req, res) => res.json(await buscarCartas(req.query.juego, req.query.q));
