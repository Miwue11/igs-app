/** Escala de notas de IGS y su nombre en la etiqueta. */
const ESCALA = [
  [10, 'PRISTINE'],
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

/** Devuelve el nombre de grado para una nota (9.5 → "GEM MINT"). */
export const etiquetaGrado = (nota) => {
  const valor = Number(nota);
  const fila = ESCALA.find(([minimo]) => valor >= minimo);
  return fila ? fila[1] : '';
};

/** Comprueba que la nota está en la escala 1–10 con pasos de 0,5. */
export const esNotaValida = (nota) => {
  const valor = Number(nota);
  return Number.isFinite(valor) && valor >= 1 && valor <= 10 && (valor * 2) % 1 === 0;
};
