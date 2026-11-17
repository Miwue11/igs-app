import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.SECRETO_JWT = 'clave-de-prueba';
const { codigoUV, codigoUVCorrecto } = await import('../src/servicios/codigoUV.servicio.js');

test('cada certificado tiene su código UV y solo ese código es válido', () => {
  const a = codigoUV('IGS-2026-000001');
  const b = codigoUV('IGS-2026-000002');
  assert.match(a, /^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
  assert.notEqual(a, b);
  assert.equal(codigoUV('IGS-2026-000001'), a);
  assert.ok(codigoUVCorrecto('IGS-2026-000001', a.toLowerCase().replace('-', ' ')));
  assert.ok(!codigoUVCorrecto('IGS-2026-000001', b));
  assert.ok(!codigoUVCorrecto('IGS-2026-000001', 'nada'));
});
