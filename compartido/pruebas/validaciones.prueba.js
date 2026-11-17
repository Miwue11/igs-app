import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarCon, sinErrores, MENSAJES } from '../index.js';

test('registro válido no devuelve errores', () => {
  const errores = validarCon('registro', {
    nombre: 'Ana', email: 'ana@correo.es', contrasena: 'secreto123', contrasena2: 'secreto123', condiciones: true,
  });
  assert.ok(sinErrores(errores));
});

test('registro detecta email mal escrito, contraseña corta y condiciones', () => {
  const errores = validarCon('registro', {
    nombre: 'Ana', email: 'ana@', contrasena: 'corta', contrasena2: 'otra', condiciones: false,
  });
  assert.equal(errores.email, MENSAJES.EMAIL);
  assert.equal(errores.contrasena, MENSAJES.CONTRASENA_CORTA);
  assert.equal(errores.contrasena2, MENSAJES.CONTRASENA_DISTINTA);
  assert.equal(errores.condiciones, MENSAJES.CONDICIONES);
});

test('campos vacíos son obligatorios', () => {
  const errores = validarCon('entrar', { email: '  ', contrasena: '' });
  assert.equal(errores.email, MENSAJES.OBLIGATORIO);
  assert.equal(errores.contrasena, MENSAJES.OBLIGATORIO);
});

const SUBNOTAS_OK = { centrado: 9.5, esquinas: 9, bordes: 9.5, superficie: 10 };

test('producto: las cuatro subnotas son obligatorias y en la escala de 0,5', () => {
  const base = { pedido: 'PED-0001', articulo: 0, nombre: 'Carta', marca: 'X', categoria: 'tcg' };
  assert.ok(sinErrores(validarCon('producto', { ...base, subnotas: SUBNOTAS_OK })));
  const errores = validarCon('producto', { ...base, subnotas: { ...SUBNOTAS_OK, bordes: 11, centrado: null } });
  assert.equal(errores['subnotas.bordes'], MENSAJES.NOTA);
  assert.equal(errores['subnotas.centrado'], MENSAJES.OBLIGATORIO);
  assert.equal(validarCon('producto', { ...base, articulo: '' }).articulo, MENSAJES.OBLIGATORIO);
});

test('producto: categoría fuera de la lista', () => {
  const errores = validarCon('producto', { pedido: 'P', nombre: 'C', marca: 'X', nota: 8, categoria: 'sellos' });
  assert.equal(errores.categoria, MENSAJES.OPCION);
});

test('pedido: cada artículo declarado necesita nombre y valor', () => {
  assert.equal(validarCon('pedido', { servicio: 'STD', articulos: [] }).articulos, MENSAJES.SIN_ARTICULOS);
  assert.match(validarCon('pedido', { servicio: 'STD', articulos: [{ nombre: 'Pikachu', valorDeclarado: 0 }] }).articulos, /artículo 1/);
  assert.match(validarCon('pedido', { servicio: 'STD', articulos: [{ nombre: 'A', valorDeclarado: 5 }, { nombre: '', valorDeclarado: 5 }] }).articulos, /artículo 2/);
  assert.ok(sinErrores(validarCon('pedido', { servicio: 'STD', articulos: [{ nombre: 'Pikachu', valorDeclarado: '40', anio: 1999 }] })));
});

test('consulta por ID de certificado', () => {
  assert.ok(sinErrores(validarCon('consulta', { id: ' igs-2026-000001 ' })));
  assert.equal(validarCon('consulta', { id: 'IGS-26-1' }).id, MENSAJES.ID_CERTIFICADO);
});

test('producto: año y expansión de la etiqueta', () => {
  const base = { pedido: 'PED-0006', articulo: 2, nombre: 'Charizard', marca: 'Pokémon', categoria: 'tcg', subnotas: SUBNOTAS_OK };
  assert.ok(sinErrores(validarCon('producto', { ...base, anio: 1999, expansion: 'Base Set' })));
  assert.ok(sinErrores(validarCon('producto', { ...base, anio: null, expansion: '' })));
  assert.equal(validarCon('producto', { ...base, anio: 1800 }).anio, MENSAJES.ANIO);
  assert.equal(validarCon('producto', { ...base, anio: 'dos mil' }).anio, MENSAJES.ANIO);
});
