import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elegir } from '../src/utilidades/elegir.js';
import { ErrorHttp, peticionIncorrecta, noEncontrado } from '../src/utilidades/errorHttp.js';
import { HTTP } from '../src/constantes/http.js';

test('elegir copia solo los campos permitidos', () => {
  const datos = { nombre: 'Carta', nota: 9, rol: 'admin', gradeadoPor: 'x' };
  assert.deepEqual(elegir(datos, ['nombre', 'nota', 'marca']), { nombre: 'Carta', nota: 9 });
});

test('los errores HTTP llevan su código', () => {
  const error = peticionIncorrecta('mal', { campo: 'x' });
  assert.ok(error instanceof ErrorHttp);
  assert.equal(error.status, HTTP.PETICION_INCORRECTA);
  assert.deepEqual(error.detalles, { campo: 'x' });
  assert.equal(noEncontrado().status, HTTP.NO_ENCONTRADO);
});
