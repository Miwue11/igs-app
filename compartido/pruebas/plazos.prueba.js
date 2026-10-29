import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PLAZO_BASICO_DIAS, ESTADOS_PLAZO, calcularFechaLimite, diasRestantes, estadoPlazo, ordenarCola, ventajasServicio,
} from '../index.js';
import { DEMO_SERVICIOS } from '../demo/datos.js';

const DIA = 24 * 60 * 60 * 1000;
const ahora = new Date('2026-10-26T10:00:00Z');
const enDias = (n) => new Date(ahora.getTime() + n * DIA).toISOString();

test('el gradeo básico tiene 14 días y los superiores menos', () => {
  const estandar = DEMO_SERVICIOS.find((s) => s.codigo === 'STD');
  assert.equal(PLAZO_BASICO_DIAS, 14);
  assert.equal(estandar.plazoDias, 14);
  DEMO_SERVICIOS.filter((s) => s.prioridad > 0).forEach((s) => assert.ok(s.plazoDias < 14, s.codigo));
});

test('fecha límite = creación + días del servicio', () => {
  assert.equal(calcularFechaLimite('2026-10-01T09:00:00.000Z', 14), '2026-10-15T09:00:00.000Z');
  assert.equal(diasRestantes(enDias(4), ahora), 4);
  assert.equal(diasRestantes(enDias(-2), ahora), -2);
});

test('estado del plazo', () => {
  assert.equal(estadoPlazo({ fechaLimite: enDias(10) }, ahora), ESTADOS_PLAZO.EN_PLAZO);
  assert.equal(estadoPlazo({ fechaLimite: enDias(2) }, ahora), ESTADOS_PLAZO.PROXIMO);
  assert.equal(estadoPlazo({ fechaLimite: enDias(-0.1) }, ahora), ESTADOS_PLAZO.VENCIDO);
  assert.equal(estadoPlazo({ fechaLimite: enDias(-1), fechaPublicacion: enDias(-2) }, ahora), ESTADOS_PLAZO.CUMPLIDO);
  assert.equal(estadoPlazo({ fechaLimite: enDias(-3), fechaPublicacion: enDias(-1) }, ahora), ESTADOS_PLAZO.CUMPLIDO_TARDE);
});

test('la cola da prioridad a los servicios superiores sin incumplir el plazo básico', () => {
  const pedido = (codigo, prioridad, limite, llegada = -1) =>
    ({ codigo, servicio: { prioridad }, fechaLimite: enDias(limite), fechaLlegada: llegada === null ? null : enDias(llegada) });
  const cola = ordenarCola([
    pedido('ESTANDAR', 0, 10, -5),
    pedido('PREMIUM', 2, 3, -1),
    pedido('EXPRESS', 1, 6, -2),
    pedido('ESTANDAR_URGENTE', 0, 2, -12),
    pedido('SIN_LLEGAR', 2, 1, null),
  ], ahora);
  assert.deepEqual(cola.map((p) => p.codigo), ['ESTANDAR_URGENTE', 'PREMIUM', 'EXPRESS', 'ESTANDAR', 'SIN_LLEGAR']);
});

test('ventajas de cada servicio', () => {
  assert.deepEqual(ventajasServicio({ plazoDias: 14, prioridad: 0 }), ['Publicado en 14 días como máximo']);
  assert.deepEqual(ventajasServicio({ plazoDias: 3, prioridad: 2, extras: ['Doble revisión'] }),
    ['Publicado en 3 días como máximo', 'Prioridad máxima en la cola', 'Doble revisión']);
});
