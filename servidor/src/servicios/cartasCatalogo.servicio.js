import {
  APIS_CARTAS, BUSCADORES_LIBRES, JUEGOS_BASE, MAXIMO_RESULTADOS, PREFIJO_CARDTRADER, formatearRareza, normalizarBusqueda,
} from '../../../compartido/index.js';
import { ENTORNO } from '../configuracion/entorno.js';
import { CartaCatalogo, Contador } from '../modelos/index.js';
import { peticionIncorrecta } from '../utilidades/errorHttp.js';

/**
 * Buscador de cartas del servidor:
 *   - Lorcana, One Piece y Digimon: hace de intermediario con sus APIs gratuitas y guarda las respuestas en caché.
 *   - El resto de juegos: busca en el catálogo de CardTrader sincronizado en MongoDB (colección catalogo_cartas).
 * Pokémon, Magic y Yu-Gi-Oh! los consulta el navegador directamente (TCGdex, Scryfall, YGOPRODeck).
 */

const MINIMO_LETRAS = 3;
const CLAVE_SINCRONIZACION = 'catalogo-cardtrader-sincronizado';

/* ---------- Caché en memoria de las fuentes gratuitas ---------- */

const DURACION_CACHE_MS = 60 * 60 * 1000;
const MAXIMO_CACHE = 500;
const cache = new Map();

const enCache = async (clave, obtener) => {
  const guardado = cache.get(clave);
  if (guardado && Date.now() - guardado.fecha < DURACION_CACHE_MS) return guardado.valor;
  const valor = await obtener();
  if (cache.size >= MAXIMO_CACHE) cache.delete(cache.keys().next().value);
  cache.set(clave, { fecha: Date.now(), valor });
  return valor;
};

/* ---------- Juegos disponibles ---------- */

let cacheJuegosCardTrader = null;

/** Juegos sincronizados de CardTrader (con al menos una carta en el catálogo), ordenados por nombre. */
const juegosCardTrader = async () => {
  if (cacheJuegosCardTrader && Date.now() - cacheJuegosCardTrader.fecha < 10 * 60 * 1000) return cacheJuegosCardTrader.valor;
  const grupos = await CartaCatalogo.aggregate([
    { $group: { _id: '$juegoId', nombre: { $first: '$juego' }, cartas: { $sum: 1 } } },
    { $sort: { nombre: 1 } },
  ]);
  const valor = grupos.map((g) => ({
    id: `${PREFIJO_CARDTRADER}${g._id}`, nombre: g.nombre, marca: g.nombre, fuente: 'CardTrader', servidor: true, cartas: g.cartas,
  }));
  cacheJuegosCardTrader = { fecha: Date.now(), valor };
  return valor;
};

export const listarJuegos = async () => [...JUEGOS_BASE, ...(await juegosCardTrader())];

/* ---------- Búsqueda ---------- */

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buscarEnCardTrader = async (juegoId, nombre) => {
  const buscado = normalizarBusqueda(nombre);
  // Coincide al principio de cualquier palabra del nombre: «zard» no encuentra «Charizard», «chari» sí.
  const cartas = await CartaCatalogo
    .find({ juegoId, nombreBusqueda: { $regex: `(^| )${escaparRegex(buscado)}` } })
    .sort({ nombre: 1, expansion: 1 })
    .limit(MAXIMO_RESULTADOS)
    .lean();
  return cartas.map((c) => ({
    id: `${PREFIJO_CARDTRADER}${c.idExterno}`,
    juego: `${PREFIJO_CARDTRADER}${c.juegoId}`,
    marca: c.juego,
    nombre: [c.nombre, c.version].filter(Boolean).join(' - '),
    expansion: c.expansion,
    anio: null,
    numero: c.numero || c.codigoExpansion,
    rareza: formatearRareza(c.rareza),
    variedad: '',
    imagen: imagenCardTrader(c.imagen),
  }));
};

/** Busca cartas por nombre en el juego indicado. */
export const buscarCartas = async (juego, nombre) => {
  const texto = String(nombre ?? '').trim();
  if (texto.length < MINIMO_LETRAS) throw peticionIncorrecta(`Escribe al menos ${MINIMO_LETRAS} letras.`);

  if (BUSCADORES_LIBRES[juego]) {
    return enCache(`${juego}|${normalizarBusqueda(texto)}`, () => BUSCADORES_LIBRES[juego](texto));
  }
  const juegoId = String(juego).startsWith(PREFIJO_CARDTRADER) ? Number(String(juego).slice(PREFIJO_CARDTRADER.length)) : NaN;
  if (Number.isInteger(juegoId) && juegoId > 0) return buscarEnCardTrader(juegoId, texto);
  throw peticionIncorrecta('Ese juego no está disponible en el buscador.');
};

/* ---------- Sincronización con CardTrader ---------- */

/** Juegos que ya tienen una API gratuita mejor (con año, idiomas…): no se descargan de CardTrader. */
const CUBIERTOS = ['magic', 'pokemon', 'yu gi oh', 'yugioh', 'one piece', 'lorcana', 'digimon'];
const estaCubierto = (juego) => {
  const nombre = normalizarBusqueda(`${juego.name} ${juego.display_name}`);
  return CUBIERTOS.some((c) => nombre.includes(c));
};

/** Unas 8 peticiones por segundo, muy por debajo del límite de CardTrader (200 cada 10 segundos). */
const PAUSA_MS = 125;
const esperar = (ms) => new Promise((resolver) => { setTimeout(resolver, ms); });

const pedirCardTrader = async (ruta) => {
  await esperar(PAUSA_MS);
  const respuesta = await fetch(`${APIS_CARTAS.CARDTRADER}${ruta}`, {
    headers: { Authorization: `Bearer ${ENTORNO.CARDTRADER_TOKEN}`, Accept: 'application/json' },
  });
  if (respuesta.status === 401) throw new Error('CardTrader ha rechazado el token (CARDTRADER_TOKEN).');
  if (respuesta.status === 404) return [];
  if (!respuesta.ok) throw new Error(`CardTrader respondió ${respuesta.status} en ${ruta}`);
  const cuerpo = await respuesta.json();
  // Algunas listas llegan como array y otras dentro de { array: [...] }.
  return Array.isArray(cuerpo) ? cuerpo : (cuerpo?.array ?? cuerpo?.data ?? []);
};

/** Las cartas sin foto en CardTrader traen una imagen genérica (assets/fallbacks): mejor ninguna. */
const imagenCardTrader = (url) => {
  if (!url || url.includes('/assets/fallbacks/')) return null;
  return url.startsWith('/') ? `https://www.cardtrader.com${url}` : url;
};

/** Rareza y número de colección vienen en las propiedades fijas, con un nombre distinto según el juego. */
const propiedad = (propiedades = {}, prueba) => {
  const clave = Object.keys(propiedades).find(prueba);
  return clave ? String(propiedades[clave] ?? '') : '';
};

const cartaDesdeBlueprint = (b, juego, expansion) => ({
  fuente: 'cardtrader',
  idExterno: b.id,
  juegoId: juego.id,
  juego: juego.display_name || juego.name,
  expansionId: expansion.id,
  expansion: expansion.name ?? '',
  codigoExpansion: expansion.code ?? '',
  nombre: b.name,
  nombreBusqueda: normalizarBusqueda(b.name),
  version: b.version ?? '',
  numero: propiedad(b.fixed_properties, (k) => /collector_number|^number$/.test(k)),
  rareza: propiedad(b.fixed_properties, (k) => /rarity$/.test(k)),
  imagen: imagenCardTrader(b.image_url ?? b.image?.url),
});

/** Juegos que se van a sincronizar: los de CARDTRADER_JUEGOS o todos los que no tienen API gratuita. */
const juegosASincronizar = (juegos) => {
  const elegidos = ENTORNO.CARDTRADER_JUEGOS.split(',').map((t) => Number(t.trim())).filter(Boolean);
  if (elegidos.length > 0) return juegos.filter((j) => elegidos.includes(j.id));
  return juegos.filter((j) => !estaCubierto(j));
};

/**
 * Descarga de CardTrader las cartas sueltas de cada expansión y las guarda (o actualiza) en catalogo_cartas.
 * Se puede repetir sin duplicar nada: cada carta se identifica por su id de CardTrader.
 */
export const sincronizarCardTrader = async ({ registrar = console.log } = {}) => {
  if (!ENTORNO.CARDTRADER_TOKEN) throw new Error('Falta CARDTRADER_TOKEN: créalo en Ajustes → API de tu perfil de CardTrader.');
  const juegos = juegosASincronizar(await pedirCardTrader('/games'));
  const expansiones = await pedirCardTrader('/expansions');
  registrar(`[igs] Sincronizando el catálogo de CardTrader: ${juegos.length} juegos (${juegos.map((j) => j.display_name || j.name).join(', ')})`);
  let total = 0;

  for (const juego of juegos) {
    // Solo cartas sueltas: las categorías de sobres, cajas o accesorios no se gradean.
    const categorias = await pedirCardTrader(`/categories?game_id=${juego.id}`);
    const sueltas = new Set(categorias.filter((c) => /single|card/i.test(c.name) && !/box|booster|pack|deck|accessor|sealed|lot|sleeve|playmat|binder/i.test(c.name)).map((c) => c.id));
    const suyas = expansiones.filter((e) => e.game_id === juego.id);
    let delJuego = 0;

    for (const expansion of suyas) {
      const blueprints = await pedirCardTrader(`/blueprints/export?expansion_id=${expansion.id}`);
      const cartas = blueprints
        .filter((b) => b.name && (sueltas.size === 0 || sueltas.has(b.category_id)))
        .map((b) => cartaDesdeBlueprint(b, juego, expansion));
      if (cartas.length === 0) continue;
      await CartaCatalogo.bulkWrite(cartas.map((c) => ({
        updateOne: { filter: { fuente: c.fuente, idExterno: c.idExterno }, update: { $set: c }, upsert: true },
      })), { ordered: false });
      delJuego += cartas.length;
    }
    total += delJuego;
    registrar(`[igs] CardTrader · ${juego.display_name || juego.name}: ${delJuego} cartas en ${suyas.length} expansiones`);
  }

  await Contador.findByIdAndUpdate(CLAVE_SINCRONIZACION, { secuencia: Date.now() }, { upsert: true });
  cacheJuegosCardTrader = null;
  registrar(`[igs] Catálogo de CardTrader sincronizado: ${total} cartas de ${juegos.length} juegos.`);
  return { juegos: juegos.length, cartas: total };
};

/**
 * Al arrancar: si hay token y el catálogo nunca se ha completado, se descarga en segundo plano (no retrasa el arranque).
 * Si un despliegue corta la descarga a medias, al volver a arrancar se reanuda: como no duplica, se repite entera.
 */
export const sincronizarCatalogoSiVacio = async () => {
  if (!ENTORNO.CARDTRADER_TOKEN) return;
  if (await Contador.exists({ _id: CLAVE_SINCRONIZACION })) return;
  sincronizarCardTrader().catch((error) => console.error('[igs] No se pudo sincronizar CardTrader:', error.message));
};
