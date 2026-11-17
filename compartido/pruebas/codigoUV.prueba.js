import { test } from 'node:test';
import assert from 'node:assert/strict';
import { codigoUVDesdeBytes, normalizarCodigoUV, esCodigoUVConFormato, validarCon, MENSAJES } from '../index.js';

test('código UV: 8 caracteres sin letras confundibles', () => {
  assert.equal(codigoUVDesdeBytes([0, 0, 0, 0, 0]), '0000-0000');
  assert.equal(codigoUVDesdeBytes([255, 255, 255, 255, 255]), 'ZZZZ-ZZZZ');
  assert.match(codigoUVDesdeBytes([18, 52, 86, 120, 154]), /^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
});

test('código UV: se acepta escrito a mano (minúsculas, sin guion, O por 0, I/L por 1)', () => {
  assert.equal(normalizarCodigoUV(' 7qk2 m9xd '), '7QK2-M9XD');
  assert.equal(normalizarCodigoUV('o1l2-I3O4'), '0112-1304');
  assert.ok(esCodigoUVConFormato('7qk2m9xd'));
  assert.ok(!esCodigoUVConFormato('7QK2'));
  assert.ok(!esCodigoUVConFormato('7QK2-M9XU')); // la U no existe en el alfabeto
  assert.equal(validarCon('verificarUV', { codigo: 'abc' }).codigo, MENSAJES.CODIGO_UV);
});
