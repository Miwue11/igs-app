import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizarBusqueda, buscarLorcana, buscarOnePiece, buscarDigimon } from '../utilidades/fuentesCartas.js';
import { imagenOficialValida } from '../utilidades/pedidos.js';

/** Sustituye fetch por respuestas fijas con la forma real de cada API (consultadas en noviembre de 2026). */
const simularFetch = (respuestas) => {
  const original = globalThis.fetch;
  const pedidas = [];
  globalThis.fetch = async (url) => {
    pedidas.push(String(url));
    const clave = Object.keys(respuestas).find((k) => String(url).includes(k));
    const cuerpo = clave ? respuestas[clave] : null;
    return { ok: cuerpo !== null, status: cuerpo === null ? 404 : 200, json: async () => cuerpo };
  };
  return { pedidas, restaurar: () => { globalThis.fetch = original; } };
};

test('normalizarBusqueda quita tildes, mayúsculas y signos', () => {
  assert.equal(normalizarBusqueda('  Pokémon: Pikachu!  '), 'pokemon pikachu');
  assert.equal(normalizarBusqueda('Roronoa Zoro (001)'), 'roronoa zoro 001');
});

test('Lorcana: nombre con versión, expansión, año, número e imagen de Lorcast', async () => {
  const f = simularFetch({
    'api.lorcast.com': {
      results: [{
        id: 'crd_1', name: 'Elsa', version: 'Spirit of Winter', set: { code: '1', name: 'The First Chapter' },
        collector_number: '207', rarity: 'Enchanted', released_at: '2023-08-18',
        image_uris: { digital: { small: 'https://cards.lorcast.io/card/digital/small/crd_1.avif' } },
      }],
    },
  });
  try {
    const [carta] = await buscarLorcana('Elsa');
    assert.equal(carta.nombre, 'Elsa - Spirit of Winter');
    assert.equal(carta.expansion, 'The First Chapter');
    assert.equal(carta.anio, 2023);
    assert.equal(carta.rareza, 'Enchanted');
    assert.equal(imagenOficialValida(carta.imagen), carta.imagen);
    assert.match(f.pedidas[0], /cards\/search\?q=Elsa/);
  } finally { f.restaurar(); }
});

test('One Piece: filtra el catálogo descargado por nombre y quita repetidas', async () => {
  const zoro = {
    card_name: 'Roronoa Zoro (001)', set_name: 'Romance Dawn', card_set_id: 'OP01-001', rarity: 'L',
    card_image_id: 'OP01-001', card_image: 'https://optcgapi.com/media/static/Card_Images/OP01-001.jpg',
  };
  const f = simularFetch({ allSetCards: [zoro, { ...zoro }], allSTCards: [], allPromoCards: [] });
  try {
    const cartas = await buscarOnePiece('zoro');
    assert.equal(cartas.length, 1);
    assert.equal(cartas[0].numero, 'OP01-001');
    assert.equal(cartas[0].expansion, 'Romance Dawn');
    assert.equal(imagenOficialValida(cartas[0].imagen), cartas[0].imagen);
  } finally { f.restaurar(); }
});

test('Digimon: número, expansión y rareza de digimoncard.io', async () => {
  const f = simularFetch({
    'digimoncard.io/api-public/search': [{ id: 'EX8-038', name: 'Agumon', rarity: 'C', set_name: ['EX-08: Extra Booster Chain of Liberation'] }],
  });
  try {
    const [carta] = await buscarDigimon('Agumon');
    assert.equal(carta.numero, 'EX8-038');
    assert.equal(carta.expansion, 'EX-08: Extra Booster Chain of Liberation');
    assert.equal(carta.marca, 'Digimon Card Game');
  } finally { f.restaurar(); }
});

test('Solo se guardan imágenes de los orígenes de las fuentes de cartas', () => {
  assert.equal(imagenOficialValida('https://malicioso.example/x.png'), null);
  assert.ok(imagenOficialValida('https://www.cardtrader.com/uploads/blueprints/image/1/x.jpg'));
});
