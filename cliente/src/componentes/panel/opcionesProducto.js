import { CATEGORIAS, IDIOMAS, LIMITES, SUBNOTAS } from '@compartido';

/** Opciones de los desplegables del formulario de producto. */
const pasos = (LIMITES.NOTA_MAX - LIMITES.NOTA_MIN) / LIMITES.NOTA_PASO + 1;
const NOTAS = Array.from({ length: pasos }, (_, i) => LIMITES.NOTA_MAX - i * LIMITES.NOTA_PASO);

export const OPCIONES_SUBNOTA = NOTAS.map((n) => ({ valor: String(n), texto: String(n).replace('.', ',') }));
export const OPCIONES_CATEGORIA = CATEGORIAS.map((c) => ({ valor: c.id, texto: c.nombre }));
export const OPCIONES_IDIOMA = IDIOMAS.map((i) => ({ valor: i, texto: i }));

export const CAMPO_SUBNOTA = (id) => `subnotas.${id}`;

export const PRODUCTO_VACIO = Object.freeze({
  pedido: '', articulo: '', nombre: '', marca: '', anio: '', expansion: '', clase: '', numeroTarjeta: '', categoria: 'tcg',
  variedad: '', idioma: 'Español', comentario: '',
  ...Object.fromEntries(SUBNOTAS.map((s) => [CAMPO_SUBNOTA(s.id), ''])),
});

const numeroONull = (v) => (v === '' || v == null ? null : Number(v));

/** Subnotas del formulario como números (para calcular la nota y la vista previa). */
export const subnotasDe = (valores) =>
  Object.fromEntries(SUBNOTAS.map((s) => [s.id, numeroONull(valores[CAMPO_SUBNOTA(s.id)])]));

/** Pasa los valores planos del formulario al formato que espera la API. La nota la calcula el servidor. */
export const prepararProducto = (valores) => ({
  pedido: valores.pedido,
  articulo: numeroONull(valores.articulo),
  nombre: valores.nombre.trim(),
  marca: valores.marca.trim(),
  anio: numeroONull(valores.anio),
  expansion: valores.expansion.trim(),
  clase: valores.clase.trim(),
  numeroTarjeta: valores.numeroTarjeta.trim(),
  categoria: valores.categoria,
  variedad: valores.variedad.trim(),
  idioma: valores.idioma,
  comentario: valores.comentario.trim(),
  subnotas: subnotasDe(valores),
});

/** Rellena la ficha con lo que declaró el cliente para ese artículo (el gradeador lo comprueba con la carta). */
export const valoresDesdeArticulo = (a) => ({
  nombre: a.nombre ?? '',
  marca: a.marca ?? '',
  expansion: a.expansion ?? '',
  anio: a.anio ? String(a.anio) : '',
  numeroTarjeta: a.numero ?? '',
  clase: a.rareza ?? '',
  ...(IDIOMAS.includes(a.idioma) ? { idioma: a.idioma } : {}),
});

/** Convierte lo que devuelve la IA en valores del formulario (solo lo que haya leído). */
export const valoresDesdeIA = (campos) =>
  Object.fromEntries(
    Object.entries(campos)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)]),
  );
