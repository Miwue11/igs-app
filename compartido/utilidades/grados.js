/**
 * Escala de notas de IGS y su nombre en la etiqueta.
 * El 10 tiene dos nombres: PRISTINE (las cuatro subnotas son 10) y GEM MINT (el resto de dieces).
 */
const ESCALA = [
  [10, 'GEM MINT'],
  [9.5, 'GEM MINT'],
  [9, 'MINT'],
  [8, 'NM-MT'],
  [7, 'NEAR MINT'],
  [6, 'EX-MT'],
  [5, 'EXCELLENT'],
  [4, 'VG-EX'],
  [3, 'VERY GOOD'],
  [2, 'GOOD'],
  [1, 'POOR'],
];

export const PRISTINE = 'PRISTINE';
const SUBNOTAS_PRISTINE = ['centrado', 'esquinas', 'bordes', 'superficie'];

/** Un 10 es PRISTINE solo si las cuatro subnotas también son 10. */
export const esPristine = (nota, subnotas = {}) =>
  Number(nota) === 10 && SUBNOTAS_PRISTINE.every((id) => Number(subnotas?.[id]) === 10);

/** Devuelve el nombre de grado para una nota (9.5 → "GEM MINT"; 10 con subnotas perfectas → "PRISTINE"). */
export const etiquetaGrado = (nota, subnotas) => {
  if (esPristine(nota, subnotas)) return PRISTINE;
  const valor = Number(nota);
  const fila = ESCALA.find(([minimo]) => valor >= minimo);
  return fila ? fila[1] : '';
};

/**
 * Color del distintivo de la etiqueta:
 * - "pristine": rojo metálico (10 PRISTINE)
 * - "oro": dorado (10 GEM MINT y 9,5)
 * - "plata": plateado (del 9 hacia abajo)
 */
export const nivelGrado = (nota, etiqueta) => {
  if (etiqueta === PRISTINE) return 'pristine';
  return Number(nota) >= 9.5 ? 'oro' : 'plata';
};

/** Comprueba que la nota está en la escala 1–10 con pasos de 0,5. */
export const esNotaValida = (nota) => {
  const valor = Number(nota);
  return Number.isFinite(valor) && valor >= 1 && valor <= 10 && (valor * 2) % 1 === 0;
};
