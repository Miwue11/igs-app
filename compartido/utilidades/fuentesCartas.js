/**
 * Fuentes públicas y gratuitas (sin clave) de juegos que no cubren TCGdex, Scryfall ni YGOPRODeck.
 * Las usa el servidor (que hace de intermediario y guarda en caché) y, en el modo demo, el navegador.
 *   - Disney Lorcana: Lorcast (https://lorcast.com/docs/api), búsqueda por texto.
 *   - One Piece Card Game: OPTCG API (https://optcgapi.com), sin búsqueda: se descarga el catálogo y se filtra.
 *   - Digimon Card Game: digimoncard.io (https://digimoncard.io), búsqueda por nombre (15 peticiones / 10 s).
 * Todas devuelven cartas con el mismo formato que el buscador del cliente.
 */

export const URLS_FUENTES_LIBRES = Object.freeze({
  LORCANA: 'https://api.lorcast.com/v0',
  ONE_PIECE: 'https://optcgapi.com/api',
  DIGIMON: 'https://digimoncard.io/api-public',
});

export const MAXIMO_RESULTADOS = 8;

/** Minúsculas, sin tildes ni signos: «Pokémon: Pikachu!» → «pokemon pikachu». */
export const normalizarBusqueda = (texto = '') => String(texto)
  .normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** «super_rare» → «Super rare», «c» → «C»: las rarezas llegan con formatos distintos según la fuente. */
export const formatearRareza = (rareza = '') => {
  const texto = String(rareza ?? '').replace(/_/g, ' ').trim();
  if (texto.length <= 3) return texto.toUpperCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const anioDe = (fecha) => (fecha ? Number(String(fecha).slice(0, 4)) || null : null);

const pedirJSON = async (url, { senal, vacioSi = [] } = {}) => {
  const respuesta = await fetch(url, { signal: senal, headers: { Accept: 'application/json' } });
  if (vacioSi.includes(respuesta.status)) return null;
  if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`);
  return respuesta.json();
};

/* ---------- Disney Lorcana (Lorcast) ---------- */

export const buscarLorcana = async (nombre, { senal } = {}) => {
  // Lorcast pide la consulta codificada en la URL (URLSearchParams ya lo hace). Respuesta: { results: [...] }.
  const consulta = new URLSearchParams({ q: nombre.replace(/"/g, '') });
  const cuerpo = await pedirJSON(`${URLS_FUENTES_LIBRES.LORCANA}/cards/search?${consulta}`, { senal, vacioSi: [404] });
  return (cuerpo?.results ?? []).slice(0, MAXIMO_RESULTADOS).map((c) => ({
    id: `lorcana-${c.id}`,
    juego: 'lorcana',
    marca: 'Disney Lorcana',
    nombre: [c.name, c.version].filter(Boolean).join(' - '),
    expansion: c.set?.name ?? '',
    anio: anioDe(c.released_at),
    numero: c.set?.code && c.collector_number ? `${c.collector_number} · set ${c.set.code}` : String(c.collector_number ?? ''),
    rareza: formatearRareza(c.rarity),
    variedad: '',
    imagen: c.image_uris?.digital?.small ?? c.image_uris?.digital?.normal ?? null,
  }));
};

/* ---------- One Piece Card Game (OPTCG API) ---------- */

/** El catálogo entero (sobres, mazos de inicio y promos) se descarga una vez y se guarda en memoria. */
const RUTAS_ONE_PIECE = ['allSetCards', 'allSTCards', 'allPromoCards'];
const DURACION_CACHE_MS = 24 * 60 * 60 * 1000;
let cacheOnePiece = null;

const catalogoOnePiece = (senal) => {
  if (!cacheOnePiece || Date.now() - cacheOnePiece.fecha > DURACION_CACHE_MS) {
    const promesa = Promise.all(RUTAS_ONE_PIECE.map((ruta) =>
      pedirJSON(`${URLS_FUENTES_LIBRES.ONE_PIECE}/${ruta}/`, { senal, vacioSi: [404] }).catch(() => [])))
      .then((listas) => {
        const cartas = listas.flat().filter(Boolean);
        if (cartas.length === 0) cacheOnePiece = null;
        return cartas.map((c) => ({ ...c, busqueda: normalizarBusqueda(c.card_name) }));
      });
    cacheOnePiece = { fecha: Date.now(), promesa };
  }
  return cacheOnePiece.promesa;
};

export const buscarOnePiece = async (nombre, { senal } = {}) => {
  const buscado = normalizarBusqueda(nombre);
  const cartas = await catalogoOnePiece(senal);
  const vistas = new Set();
  return cartas
    .filter((c) => c.busqueda.includes(buscado))
    .filter((c) => {
      // La misma carta puede venir repetida (p. ej. en un mazo y en una promo): una sola por imagen.
      const clave = c.card_image_id ?? c.card_set_id;
      if (vistas.has(clave)) return false;
      vistas.add(clave);
      return true;
    })
    .slice(0, MAXIMO_RESULTADOS)
    .map((c) => ({
      id: `onepiece-${c.card_image_id ?? c.card_set_id}`,
      juego: 'onepiece',
      marca: 'One Piece Card Game',
      nombre: c.card_name,
      expansion: c.set_name ?? '',
      anio: null,
      numero: c.card_set_id ?? '',
      rareza: c.rarity ?? '',
      variedad: /_p\d|parallel/i.test(c.card_image_id ?? '') ? 'Arte alternativo' : '',
      imagen: c.card_image ?? null,
    }));
};

/* ---------- Digimon Card Game (digimoncard.io) ---------- */

export const URL_IMAGEN_DIGIMON = 'https://images.digimoncard.io/images/cards';

export const buscarDigimon = async (nombre, { senal } = {}) => {
  const consulta = new URLSearchParams({ n: nombre });
  const cartas = await pedirJSON(`${URLS_FUENTES_LIBRES.DIGIMON}/search?${consulta}`, { senal, vacioSi: [400, 404] });
  return (Array.isArray(cartas) ? cartas : []).slice(0, MAXIMO_RESULTADOS).map((c) => ({
    id: `digimon-${c.id}`,
    juego: 'digimon',
    marca: 'Digimon Card Game',
    nombre: c.name,
    expansion: Array.isArray(c.set_name) ? c.set_name.join(' / ') : (c.set_name ?? ''),
    anio: null,
    numero: c.id ?? '',
    rareza: formatearRareza(c.rarity),
    variedad: '',
    imagen: c.image_url ?? (c.id ? `${URL_IMAGEN_DIGIMON}/${encodeURIComponent(c.id)}.jpg` : null),
  }));
};

/** Juegos con fuente gratuita propia: los busca el servidor (o el navegador en la demo). */
export const BUSCADORES_LIBRES = Object.freeze({
  lorcana: buscarLorcana,
  onepiece: buscarOnePiece,
  digimon: buscarDigimon,
});
