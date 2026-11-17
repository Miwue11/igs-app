import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularNotaFinal, etiquetaGrado, nivelGrado, errorArticulosServicio, importePedido, prepararArticulos,
  pedidoNuevo, errorCambioEstado, aplicarCambioEstado, errorResolverArticulo, estadoPlazo,
  ESTADOS_PEDIDO, ESTADOS_ARTICULO, ESTADOS_PLAZO, ENVIO_VUELTA_EUR,
} from '../index.js';

const sub = (centrado, esquinas, bordes, superficie) => ({ centrado, esquinas, bordes, superficie });

test('nota final calculada con las subnotas (estilo BGS)', () => {
  assert.equal(calcularNotaFinal(sub(10, 10, 10, 10)), 10);
  assert.equal(calcularNotaFinal(sub(10, 10, 10, 9.5)), 10); // media 9,875 → 10 GEM MINT
  assert.equal(calcularNotaFinal(sub(9.5, 9.5, 9.5, 10)), 9.5);
  assert.equal(calcularNotaFinal(sub(8, 7.5, 8, 8.5)), 8);
  assert.equal(calcularNotaFinal(sub(10, 10, 10, 6)), 7); // la subnota más baja limita: 6 + 1
  assert.equal(calcularNotaFinal(sub(10, 10, null, 10)), null);
});

test('PRISTINE (rojo) solo con las cuatro a 10; GEM MINT (dorado) con 10 o 9,5', () => {
  const casos = [
    [sub(10, 10, 10, 10), 'PRISTINE', 'pristine'],
    [sub(10, 10, 10, 9.5), 'GEM MINT', 'oro'],
    [sub(9.5, 9.5, 9.5, 10), 'GEM MINT', 'oro'],
    [sub(9, 9, 9, 9), 'MINT', 'plata'],
  ];
  for (const [subnotas, nombre, nivel] of casos) {
    const nota = calcularNotaFinal(subnotas);
    assert.equal(etiquetaGrado(nota, subnotas), nombre);
    assert.equal(nivelGrado(nota, etiquetaGrado(nota, subnotas)), nivel);
  }
});

const STD = { codigo: 'STD', nombre: 'Estándar', precio: 15, plazoDias: 14, prioridad: 0, valorMax: 500, minimoUnidades: 1 };
const BLQ = { ...STD, codigo: 'BLQ', precio: 10, valorMax: 200, minimoUnidades: 20 };
const articulos = prepararArticulos([
  { nombre: 'Pikachu', valorDeclarado: '40' },
  { nombre: 'Charizard', valorDeclarado: 450 },
]);

test('valor declarado y mínimo de artículos según el servicio', () => {
  assert.equal(errorArticulosServicio(STD, articulos), null);
  assert.match(errorArticulosServicio(STD, prepararArticulos([{ nombre: 'Lugia', valorDeclarado: 900 }])), /Lugia.*servicio superior/);
  assert.match(errorArticulosServicio(BLQ, articulos), /al menos 20/);
  assert.equal(errorArticulosServicio({ ...STD, valorMax: null }, prepararArticulos([{ nombre: 'X', valorDeclarado: 9e5 }])), null);
});

test('importe: gradeo por artículo + envío de vuelta asegurado', () => {
  assert.deepEqual(importePedido(STD, articulos), { gradeo: 30, envio: ENVIO_VUELTA_EUR, total: 30 + ENVIO_VUELTA_EUR, valorDeclarado: 490 });
  assert.equal(importePedido({ ...STD, precio: null }, articulos).total, null);
});

test('el plazo empieza al recibir el paquete, no al crear el pedido', () => {
  const pedido = { ...pedidoNuevo(STD, articulos, '2026-11-01T10:00:00.000Z'), estado: ESTADOS_PEDIDO.PENDIENTE_ENVIO };
  assert.equal(pedido.fechaLimite, null);
  assert.equal(estadoPlazo(pedido), ESTADOS_PLAZO.SIN_INICIAR);
  aplicarCambioEstado(pedido, ESTADOS_PEDIDO.RECIBIDO, '2026-11-10T10:00:00.000Z');
  assert.equal(pedido.fechaLimite, '2026-11-24T10:00:00.000Z');
});

test('los estados avanzan de uno en uno y no se publica con artículos pendientes', () => {
  const pedido = { ...pedidoNuevo(STD, prepararArticulos(articulos)), estado: ESTADOS_PEDIDO.PENDIENTE_ENVIO };
  assert.match(errorCambioEstado(pedido, ESTADOS_PEDIDO.COMPLETADO), /siguiente estado/);
  assert.equal(errorCambioEstado(pedido, ESTADOS_PEDIDO.RECIBIDO), null);
  assert.match(errorResolverArticulo(pedido, 0), /En gradeo/);

  pedido.estado = ESTADOS_PEDIDO.EN_GRADEO;
  assert.match(errorCambioEstado(pedido, ESTADOS_PEDIDO.COMPLETADO), /Quedan 2/);
  assert.equal(errorResolverArticulo(pedido, 0), null);
  assert.match(errorResolverArticulo(pedido, 5), /no existe/);

  pedido.articulos[0].estado = ESTADOS_ARTICULO.GRADEADO;
  pedido.articulos[1].estado = ESTADOS_ARTICULO.NO_GRADEABLE;
  assert.match(errorResolverArticulo(pedido, 0), /ya está resuelto/);
  assert.equal(errorCambioEstado(pedido, ESTADOS_PEDIDO.COMPLETADO), null);
});
