import { CATEGORIAS, IDIOMAS, LIMITES, SUBNOTAS, etiquetaGrado } from '@compartido';

/** Opciones de los desplegables del formulario de producto. */
const pasos = (LIMITES.NOTA_MAX - LIMITES.NOTA_MIN) / LIMITES.NOTA_PASO + 1;
const NOTAS = Array.from({ length: pasos }, (_, i) => LIMITES.NOTA_MAX - i * LIMITES.NOTA_PASO);

export const OPCIONES_NOTA = NOTAS.map((n) => ({ valor: String(n), texto: `${String(n).replace('.', ',')} · ${etiquetaGrado(n)}` }));
export const OPCIONES_SUBNOTA = NOTAS.map((n) => ({ valor: String(n), texto: String(n).replace('.', ',') }));
export const OPCIONES_CATEGORIA = CATEGORIAS.filter((c) => c.id !== 'empresas').map((c) => ({ valor: c.id, texto: c.nombre }));
export const OPCIONES_IDIOMA = IDIOMAS.map((i) => ({ valor: i, texto: i }));

export const CAMPO_SUBNOTA = (id) => `subnotas.${id}`;

export const PRODUCTO_VACIO = Object.freeze({
  pedido: '', nombre: '', nota: '', marca: '', clase: '', numeroTarjeta: '', categoria: 'tcg',
  variedad: '', idioma: 'Español', comentario: '',
  ...Object.fromEntries(SUBNOTAS.map((s) => [CAMPO_SUBNOTA(s.id), ''])),
});

const numeroONull = (v) => (v === '' || v == null ? null : Number(v));

/** Pasa los valores planos del formulario al formato que espera la API. */
export const prepararProducto = (valores) => ({
  pedido: valores.pedido,
  nombre: valores.nombre.trim(),
  nota: numeroONull(valores.nota),
  marca: valores.marca.trim(),
  clase: valores.clase.trim(),
  numeroTarjeta: valores.numeroTarjeta.trim(),
  categoria: valores.categoria,
  variedad: valores.variedad.trim(),
  idioma: valores.idioma,
  comentario: valores.comentario.trim(),
  subnotas: Object.fromEntries(SUBNOTAS.map((s) => [s.id, numeroONull(valores[CAMPO_SUBNOTA(s.id)])])),
});

/** Convierte lo que devuelve la IA en valores del formulario (solo lo que haya leído). */
export const valoresDesdeIA = (campos) =>
  Object.fromEntries(
    Object.entries(campos)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)]),
  );
