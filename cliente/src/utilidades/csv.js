const celda = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`;

/** Convierte filas en texto CSV (separador ; para que Excel en español lo abra bien). */
export const aCsv = (columnas, filas) =>
  [columnas.map((c) => celda(c.titulo)), ...filas.map((fila) => columnas.map((c) => celda(c.valor(fila))))]
    .map((linea) => linea.join(';'))
    .join('\n');

/** Descarga un texto como archivo. */
export const descargarArchivo = (nombre, texto, tipo = 'text/csv') => {
  const url = URL.createObjectURL(new Blob(['﻿', texto], { type: `${tipo};charset=utf-8` }));
  const enlace = Object.assign(document.createElement('a'), { href: url, download: nombre });
  enlace.click();
  URL.revokeObjectURL(url);
};
