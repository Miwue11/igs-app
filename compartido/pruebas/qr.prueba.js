import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearQR, qrComoRutaSVG } from '../index.js';

// La lectura real del QR se comprobó con zbar/OpenCV; aquí se vigila la estructura.
test('el QR elige la versión según la longitud y dibuja los patrones de búsqueda', () => {
  const corto = crearQR('IGS-2026-000001');
  assert.equal(corto.version, 2);
  assert.equal(corto.tamano, 25);
  const url = crearQR('https://igs-app-d3r8.onrender.com/consulta?id=IGS-2026-000001');
  assert.equal(url.version, 4);
  const esquina = (f0, c0) => [0, 6].every((d) => url.modulos[f0 + d][c0] && url.modulos[f0][c0 + d]);
  assert.ok(esquina(0, 0) && esquina(0, url.tamano - 7) && esquina(url.tamano - 7, 0));
  assert.match(qrComoRutaSVG(corto), /^M\d+ \d+h1v1h-1z/);
  assert.throws(() => crearQR('x'.repeat(400)), /demasiado largo/);
});
