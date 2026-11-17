import { APIS_CARTAS } from '@compartido';

/**
 * Búsqueda de cartas oficiales para que el cliente declare lo que envía en su pedido.
 * Usa APIs públicas y gratuitas, sin clave ni registro:
 *   - Pokémon: TCGdex (https://tcgdex.dev), multilingüe (español, inglés, japonés…)
 *   - Magic: The Gathering: Scryfall (https://scryfall.com/docs/api)
 *   - Yu-Gi-Oh!: YGOPRODeck (https://ygoprodeck.com/api-guide/)
 * Se llama directamente desde el navegador, así que funciona igual con servidor y en el modo demo.
 */

export const JUEGOS = Object.freeze([
  { id: 'pokemon', nombre: 'Pokémon', marca: 'Pokémon', fuente: 'TCGdex' },
  { id: 'magic', nombre: 'Magic: The Gathering', marca: 'Magic: The Gathering', fuente: 'Scryfall' },
  { id: 'yugioh', nombre: 'Yu-Gi-Oh!', marca: 'Yu-Gi-Oh!', fuente: 'YGOPRODeck' },
]);

const MAXIMO = 8;
const MINIMO_LETRAS = 3;

/** Idioma del producto → idioma de TCGdex. */
const IDIOMAS_TCGDEX = { Español: 'es', Inglés: 'en', Japonés: 'ja', Francés: 'fr', Alemán: 'de', Italiano: 'it' };

/** Adivina el juego por la marca escrita en el formulario (por defecto, Pokémon). */
export const juegoDeMarca = (marca = '') => {
  const texto = marca.toLowerCase();
  if (/magic|mtg/.test(texto)) return 'magic';
  if (/yu-?gi-?oh|ygo/.test(texto)) return 'yugioh';
  return 'pokemon';
};

export const hayNombreSuficiente = (nombre = '') => nombre.trim().length >= MINIMO_LETRAS;

const anioDe = (fecha) => (fecha ? Number(String(fecha).slice(0, 4)) || null : null);

const pedirJSON = async (url, { senal, vacioSi = [] } = {}) => {
  const respuesta = await fetch(url, { signal: senal, headers: { Accept: 'application/json' } });
  if (vacioSi.includes(respuesta.status)) return null;
  if (!respuesta.ok) throw new Error(`La API respondió ${respuesta.status}`);
  return respuesta.json();
};

/* ---------- Pokémon (TCGdex) ---------- */

const cacheSets = new Map();
const setTcgdex = (idioma, id, senal) => {
  const clave = `${idioma}/${id}`;
  if (!cacheSets.has(clave)) {
    cacheSets.set(clave, pedirJSON(`${APIS_CARTAS.POKEMON}/${idioma}/sets/${encodeURIComponent(id)}`, { senal })
      .catch(() => { cacheSets.delete(clave); return null; }));
  }
  return cacheSets.get(clave);
};

const variedadTcgdex = (v = {}) => {
  if (v.firstEdition) return '1ª edición';
  if (v.holo && !v.normal) return 'Holo';
  return '';
};

const buscarTcgdexEn = async (idioma, nombre, senal) => {
  const consulta = new URLSearchParams({ name: nombre, 'pagination:page': '1', 'pagination:itemsPerPage': String(MAXIMO) });
  const resumen = (await pedirJSON(`${APIS_CARTAS.POKEMON}/${idioma}/cards?${consulta}`, { senal, vacioSi: [404] })) ?? [];
  const cartas = await Promise.all(resumen.slice(0, MAXIMO).map((c) =>
    pedirJSON(`${APIS_CARTAS.POKEMON}/${idioma}/cards/${encodeURIComponent(c.id)}`, { senal }).catch(() => null)));

  return Promise.all(cartas.filter(Boolean).map(async (c) => {
    const set = await setTcgdex(idioma, c.set?.id, senal);
    const total = c.set?.cardCount?.official;
    return {
      id: `pokemon-${c.id}`,
      juego: 'pokemon',
      nombre: c.name,
      expansion: c.set?.name ?? '',
      anio: anioDe(set?.releaseDate),
      numero: total ? `${c.localId}/${String(total).padStart(String(c.localId).length, '0')}` : String(c.localId ?? ''),
      rareza: c.rarity ?? '',
      variedad: variedadTcgdex(c.variants),
      imagen: c.image ? `${c.image}/low.webp` : null,
    };
  }));
};

const buscarPokemon = async (nombre, idioma, senal) => {
  const codigo = IDIOMAS_TCGDEX[idioma] ?? 'en';
  const resultados = await buscarTcgdexEn(codigo, nombre, senal);
  // Si en el idioma del producto no aparece (p. ej. nombre escrito en inglés para una carta japonesa), se prueba en inglés.
  if (resultados.length === 0 && codigo !== 'en') return buscarTcgdexEn('en', nombre, senal);
  return resultados;
};

/* ---------- Magic (Scryfall) ---------- */

const buscarMagic = async (nombre, _idioma, senal) => {
  const consulta = new URLSearchParams({ q: nombre, unique: 'prints', order: 'released', dir: 'asc' });
  const cuerpo = await pedirJSON(`${APIS_CARTAS.MAGIC}/cards/search?${consulta}`, { senal, vacioSi: [404] });
  return (cuerpo?.data ?? []).slice(0, MAXIMO).map((c) => ({
    id: `magic-${c.id}`,
    juego: 'magic',
    nombre: c.name,
    expansion: c.set_name ?? '',
    anio: anioDe(c.released_at),
    numero: c.collector_number ?? '',
    rareza: c.rarity ?? '',
    variedad: c.finishes?.includes('foil') && !c.finishes?.includes('nonfoil') ? 'Foil' : '',
    imagen: c.image_uris?.small ?? c.card_faces?.[0]?.image_uris?.small ?? null,
  }));
};

/* ---------- Yu-Gi-Oh! (YGOPRODeck) ---------- */

let cacheSetsYgo = null;
const fechasSetsYgo = (senal) => {
  if (!cacheSetsYgo) {
    cacheSetsYgo = pedirJSON(`${APIS_CARTAS.YUGIOH}/cardsets.php`, { senal })
      .then((sets) => new Map(sets.map((s) => [s.set_name, s.tcg_date])))
      .catch(() => { cacheSetsYgo = null; return new Map(); });
  }
  return cacheSetsYgo;
};

const buscarYugioh = async (nombre, _idioma, senal) => {
  const consulta = new URLSearchParams({ fname: nombre });
  const [cuerpo, fechas] = await Promise.all([
    pedirJSON(`${APIS_CARTAS.YUGIOH}/cardinfo.php?${consulta}`, { senal, vacioSi: [400] }),
    fechasSetsYgo(senal),
  ]);
  // Una recomendación por cada impresión (carta + expansión).
  return (cuerpo?.data ?? [])
    .flatMap((c) => (c.card_sets ?? []).map((s) => ({
      id: `yugioh-${c.id}-${s.set_code}`,
      juego: 'yugioh',
      nombre: c.name,
      expansion: s.set_name,
      anio: anioDe(fechas.get(s.set_name)),
      numero: s.set_code,
      rareza: s.set_rarity ?? '',
      variedad: '',
      // YGOPRODeck pide no enlazar sus imágenes directamente, por eso no se muestra miniatura.
      imagen: null,
    })))
    .slice(0, MAXIMO);
};

const BUSCADORES = { pokemon: buscarPokemon, magic: buscarMagic, yugioh: buscarYugioh };

/** Busca cartas oficiales que coincidan con el nombre. Devuelve una lista (vacía si no hay coincidencias). */
export const buscarCartasOficiales = async ({ nombre, juego = 'pokemon', idioma, senal }) => {
  if (!hayNombreSuficiente(nombre)) return [];
  const buscar = BUSCADORES[juego] ?? buscarPokemon;
  return buscar(nombre.trim(), idioma, senal);
};

/** Pasa una carta encontrada a un artículo del pedido (el cliente solo tiene que poner el valor declarado). */
export const articuloDesdeCarta = (carta, idioma = '') => {
  const juego = JUEGOS.find((j) => j.id === carta.juego);
  return {
    nombre: carta.nombre,
    marca: juego?.marca ?? '',
    expansion: carta.expansion,
    anio: carta.anio ? String(carta.anio) : '',
    numero: carta.numero,
    idioma,
    rareza: [carta.rareza, carta.variedad].filter(Boolean).join(' · '),
    imagen: carta.imagen,
    valorDeclarado: '',
  };
};
