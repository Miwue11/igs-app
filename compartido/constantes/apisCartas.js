/**
 * Fuentes de datos oficiales de las cartas.
 *   - Pokémon, Magic y Yu-Gi-Oh!: APIs gratuitas sin clave que el navegador consulta directamente.
 *   - Lorcana, One Piece y Digimon: APIs gratuitas sin clave que consulta el servidor (y el navegador en la demo).
 *   - El resto de juegos: catálogo de CardTrader sincronizado en MongoDB (necesita CARDTRADER_TOKEN en el servidor).
 */
export const APIS_CARTAS = Object.freeze({
  POKEMON: 'https://api.tcgdex.net/v2',
  MAGIC: 'https://api.scryfall.com',
  YUGIOH: 'https://db.ygoprodeck.com/api/v7',
  CARDTRADER: 'https://api.cardtrader.com/api/v2',
});

/** Juegos que siempre están disponibles en el buscador, con su fuente. `servidor`: la búsqueda pasa por /api/catalogo. */
export const JUEGOS_BASE = Object.freeze([
  { id: 'pokemon', nombre: 'Pokémon', marca: 'Pokémon', fuente: 'TCGdex', servidor: false },
  { id: 'magic', nombre: 'Magic: The Gathering', marca: 'Magic: The Gathering', fuente: 'Scryfall', servidor: false },
  { id: 'yugioh', nombre: 'Yu-Gi-Oh!', marca: 'Yu-Gi-Oh!', fuente: 'YGOPRODeck', servidor: false },
  { id: 'onepiece', nombre: 'One Piece Card Game', marca: 'One Piece Card Game', fuente: 'OPTCG API', servidor: true },
  { id: 'lorcana', nombre: 'Disney Lorcana', marca: 'Disney Lorcana', fuente: 'Lorcast', servidor: true },
  { id: 'digimon', nombre: 'Digimon Card Game', marca: 'Digimon Card Game', fuente: 'digimoncard.io', servidor: true },
]);

/** Prefijo de los juegos que vienen del catálogo de CardTrader: «ct-<id del juego en CardTrader>». */
export const PREFIJO_CARDTRADER = 'ct-';

/** Orígenes a los que el navegador puede pedir datos (connect-src). Los de la demo incluyen las fuentes del servidor. */
export const ORIGENES_API_CARTAS = Object.freeze([
  'https://api.tcgdex.net',
  'https://api.scryfall.com',
  'https://db.ygoprodeck.com',
  'https://api.lorcast.com',
  'https://optcgapi.com',
  'https://digimoncard.io',
]);

/** Orígenes de las imágenes de las cartas (img-src) y los únicos que se guardan como imagen oficial de un artículo. */
export const ORIGENES_IMAGENES_CARTAS = Object.freeze([
  'https://assets.tcgdex.net',
  'https://cards.scryfall.io',
  'https://cards.lorcast.io',
  'https://optcgapi.com',
  'https://images.digimoncard.io',
  'https://www.cardtrader.com',
  'https://cardtrader.com',
]);
