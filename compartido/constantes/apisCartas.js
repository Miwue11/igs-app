/**
 * APIs públicas y gratuitas (sin clave) con los datos oficiales de las cartas.
 * El cliente las consulta directamente desde el navegador; el servidor las permite en su CSP.
 */
export const APIS_CARTAS = Object.freeze({
  POKEMON: 'https://api.tcgdex.net/v2',
  MAGIC: 'https://api.scryfall.com',
  YUGIOH: 'https://db.ygoprodeck.com/api/v7',
});

/** Orígenes a los que el navegador puede pedir datos (connect-src). */
export const ORIGENES_API_CARTAS = Object.freeze([
  'https://api.tcgdex.net',
  'https://api.scryfall.com',
  'https://db.ygoprodeck.com',
]);

/** Orígenes de las miniaturas de las cartas (img-src). */
export const ORIGENES_IMAGENES_CARTAS = Object.freeze([
  'https://assets.tcgdex.net',
  'https://cards.scryfall.io',
]);
