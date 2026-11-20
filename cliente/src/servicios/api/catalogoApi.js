import { peticion } from '../http.js';

/** Buscador de cartas del servidor (Lorcana, One Piece, Digimon y el catálogo de CardTrader). */
export const catalogoApi = {
  juegos: () => peticion('/catalogo/juegos'),
  cartas: (juego, nombre) => peticion(`/catalogo/cartas?${new URLSearchParams({ juego, q: nombre })}`),
};
