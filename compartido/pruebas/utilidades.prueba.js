import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatearIdCertificado, formatearPedido, normalizarIdCertificado, esIdCertificado,
  etiquetaGrado, esNotaValida, ordenarCola, siguienteEstado, ESTADOS_PEDIDO,
} from '../index.js';

test('formatos de códigos', () => {
  assert.equal(formatearIdCertificado(2026, 17), 'IGS-2026-000017');
  assert.equal(formatearPedido(43), 'PED-0043');
  assert.equal(normalizarIdCertificado('  igs-2026-000017 '), 'IGS-2026-000017');
  assert.ok(esIdCertificado('igs-2026-000017'));
  assert.ok(!esIdCertificado('IGS-2026-17'));
});

test('nombre del grado según la nota', () => {
  assert.equal(etiquetaGrado(10), 'PRISTINE');
  assert.equal(etiquetaGrado(9.5), 'GEM MINT');
  assert.equal(etiquetaGrado(8.5), 'NM-MT');
  assert.equal(etiquetaGrado(1), 'POOR');
  assert.ok(esNotaValida('7.5'));
  assert.ok(!esNotaValida(7.3));
  assert.ok(!esNotaValida(0));
});

test('la cola respeta el orden de llegada (FIFO)', () => {
  const cola = ordenarCola([
    { codigo: 'C', fechaLlegada: null, creadoEn: '2026-10-01' },
    { codigo: 'B', fechaLlegada: '2026-10-05', creadoEn: '2026-09-20' },
    { codigo: 'A', fechaLlegada: '2026-10-02', creadoEn: '2026-09-25' },
    { codigo: 'D', fechaLlegada: null, creadoEn: '2026-09-30' },
  ]);
  assert.deepEqual(cola.map((p) => p.codigo), ['A', 'B', 'D', 'C']);
});

test('avance de estados del pedido', () => {
  assert.equal(siguienteEstado(ESTADOS_PEDIDO.PENDIENTE_ENVIO), ESTADOS_PEDIDO.RECIBIDO);
  assert.equal(siguienteEstado(ESTADOS_PEDIDO.EN_GRADEO), ESTADOS_PEDIDO.COMPLETADO);
  assert.equal(siguienteEstado(ESTADOS_PEDIDO.ENVIADO), null);
});
