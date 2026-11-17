/**
 * Generador de códigos QR (modelo 2, modo byte, corrección de errores M, versiones 1 a 10).
 * Sin dependencias: lo usan la etiqueta trasera del slab (cliente) y las pruebas.
 *   crearQR('https://…') → { tamano, modulos: boolean[][] }
 *   qrComoRutaSVG(qr)    → atributo «d» de un <path> con un cuadrado por módulo oscuro
 */

/* Capacidad con corrección M: [codewords de corrección por bloque, [datos de cada bloque]] */
const BLOQUES_M = [
  null,
  [10, [16]],
  [16, [28]],
  [26, [44]],
  [18, [32, 32]],
  [24, [43, 43]],
  [16, [27, 27, 27, 27]],
  [18, [31, 31, 31, 31]],
  [22, [38, 38, 39, 39]],
  [22, [36, 36, 36, 37, 37]],
  [26, [43, 43, 43, 43, 44]],
];

const ALINEACION = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

/* ---------- Reed-Solomon en GF(256), polinomio 0x11D ---------- */
const EXP = new Array(512);
const LOG = new Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
})();
const mult = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

const generador = (grado) => {
  let poli = [1];
  for (let i = 0; i < grado; i += 1) {
    const siguiente = new Array(poli.length + 1).fill(0);
    poli.forEach((c, j) => {
      siguiente[j] ^= c;
      siguiente[j + 1] ^= mult(c, EXP[i]);
    });
    poli = siguiente;
  }
  return poli;
};

const correccion = (datos, grado) => {
  const gen = generador(grado);
  const resto = [...datos, ...new Array(grado).fill(0)];
  for (let i = 0; i < datos.length; i += 1) {
    const factor = resto[i];
    if (factor !== 0) gen.forEach((c, j) => { resto[i + j] ^= mult(c, factor); });
  }
  return resto.slice(datos.length);
};

/* ---------- Codificación de los datos ---------- */
const bytesUTF8 = (texto) => Array.from(new TextEncoder().encode(texto));

const elegirVersion = (longitud) => {
  for (let v = 1; v <= 10; v += 1) {
    const capacidad = BLOQUES_M[v][1].reduce((t, n) => t + n, 0) * 8;
    const bits = 4 + (v < 10 ? 8 : 16) + longitud * 8;
    if (bits <= capacidad) return v;
  }
  throw new Error('Texto demasiado largo para el código QR.');
};

const codewords = (bytes, version) => {
  const [grado, bloques] = BLOQUES_M[version];
  const capacidad = bloques.reduce((t, n) => t + n, 0);
  const bits = [];
  const poner = (valor, longitud) => { for (let i = longitud - 1; i >= 0; i -= 1) bits.push((valor >>> i) & 1); };
  poner(0b0100, 4);
  poner(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((b) => poner(b, 8));
  poner(0, Math.min(4, capacidad * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const datos = [];
  for (let i = 0; i < bits.length; i += 8) datos.push(bits.slice(i, i + 8).reduce((t, b) => (t << 1) | b, 0));
  for (let relleno = 0xec; datos.length < capacidad; relleno ^= 0xec ^ 0x11) datos.push(relleno);

  let pos = 0;
  const partes = bloques.map((n) => {
    const bloque = datos.slice(pos, pos + n);
    pos += n;
    return { datos: bloque, ec: correccion(bloque, grado) };
  });
  const resultado = [];
  const maximo = Math.max(...bloques);
  for (let i = 0; i < maximo; i += 1) partes.forEach((p) => { if (i < p.datos.length) resultado.push(p.datos[i]); });
  for (let i = 0; i < grado; i += 1) partes.forEach((p) => resultado.push(p.ec[i]));
  return resultado;
};

/* ---------- Matriz ---------- */
const bch = (valor, generadorBCH, grado) => {
  let resto = valor << grado;
  const alto = (n) => 31 - Math.clz32(n);
  while (resto && alto(resto) >= grado) resto ^= generadorBCH << (alto(resto) - grado);
  return (valor << grado) | resto;
};

const MASCARAS = [
  (f, c) => (f + c) % 2 === 0,
  (f) => f % 2 === 0,
  (_f, c) => c % 3 === 0,
  (f, c) => (f + c) % 3 === 0,
  (f, c) => (Math.floor(f / 2) + Math.floor(c / 3)) % 2 === 0,
  (f, c) => ((f * c) % 2) + ((f * c) % 3) === 0,
  (f, c) => (((f * c) % 2) + ((f * c) % 3)) % 2 === 0,
  (f, c) => (((f + c) % 2) + ((f * c) % 3)) % 2 === 0,
];

const matrizBase = (version) => {
  const tam = version * 4 + 17;
  const m = Array.from({ length: tam }, () => new Array(tam).fill(false));
  const fija = Array.from({ length: tam }, () => new Array(tam).fill(false));
  const poner = (f, c, v) => { m[f][c] = v; fija[f][c] = true; };

  const buscador = (f0, c0) => {
    for (let df = -1; df <= 7; df += 1) {
      for (let dc = -1; dc <= 7; dc += 1) {
        const f = f0 + df;
        const c = c0 + dc;
        if (f < 0 || c < 0 || f >= tam || c >= tam) continue;
        const borde = df === 0 || df === 6 || dc === 0 || dc === 6;
        const centro = df >= 2 && df <= 4 && dc >= 2 && dc <= 4;
        poner(f, c, df >= 0 && df <= 6 && dc >= 0 && dc <= 6 && (borde || centro));
      }
    }
  };
  buscador(0, 0);
  buscador(0, tam - 7);
  buscador(tam - 7, 0);

  for (let i = 8; i < tam - 8; i += 1) {
    poner(6, i, i % 2 === 0);
    poner(i, 6, i % 2 === 0);
  }

  const pos = ALINEACION[version];
  const ultimo = pos.length - 1;
  pos.forEach((f, i) => pos.forEach((c, j) => {
    // Las tres esquinas coinciden con los patrones de búsqueda: ahí no va patrón de alineación.
    if ((i === 0 && j === 0) || (i === 0 && j === ultimo) || (i === ultimo && j === 0)) return;
    for (let df = -2; df <= 2; df += 1) {
      for (let dc = -2; dc <= 2; dc += 1) poner(f + df, c + dc, Math.max(Math.abs(df), Math.abs(dc)) !== 1);
    }
  }));

  // Reserva de la información de formato y módulo oscuro fijo.
  for (let i = 0; i < 9; i += 1) {
    if (!fija[8][i]) poner(8, i, false);
    if (!fija[i][8]) poner(i, 8, false);
  }
  for (let i = 0; i < 8; i += 1) {
    poner(8, tam - 1 - i, false);
    poner(tam - 1 - i, 8, false);
  }
  poner(tam - 8, 8, true);

  if (version >= 7) {
    const info = bch(version, 0x1f25, 12);
    for (let i = 0; i < 18; i += 1) {
      const bit = ((info >>> i) & 1) === 1;
      const a = tam - 11 + (i % 3);
      const b = Math.floor(i / 3);
      poner(a, b, bit);
      poner(b, a, bit);
    }
  }
  return { tam, m, fija };
};

const ponerFormato = (m, tam, mascara) => {
  const info = bch((0b00 << 3) | mascara, 0x537, 10) ^ 0x5412; // corrección M = 00
  const bit = (i) => ((info >>> i) & 1) === 1;
  for (let i = 0; i <= 5; i += 1) m[i][8] = bit(i);
  m[7][8] = bit(6);
  m[8][8] = bit(7);
  m[8][7] = bit(8);
  for (let i = 9; i < 15; i += 1) m[8][14 - i] = bit(i);
  for (let i = 0; i < 8; i += 1) m[8][tam - 1 - i] = bit(i);
  for (let i = 8; i < 15; i += 1) m[tam - 15 + i][8] = bit(i);
  m[tam - 8][8] = true;
};

const colocarDatos = (m, fija, tam, datos) => {
  let i = 0;
  const total = datos.length * 8;
  for (let derecha = tam - 1; derecha >= 1; derecha -= 2) {
    if (derecha === 6) derecha = 5;
    for (let vert = 0; vert < tam; vert += 1) {
      for (let j = 0; j < 2; j += 1) {
        const c = derecha - j;
        const subiendo = ((derecha + 1) & 2) === 0;
        const f = subiendo ? tam - 1 - vert : vert;
        if (!fija[f][c] && i < total) {
          m[f][c] = ((datos[i >>> 3] >>> (7 - (i & 7))) & 1) === 1;
          i += 1;
        }
      }
    }
  }
};

const penalizacion = (m, tam) => {
  let total = 0;
  const lineas = (obtener) => {
    for (let a = 0; a < tam; a += 1) {
      let racha = 1;
      for (let b = 1; b <= tam; b += 1) {
        if (b < tam && obtener(a, b) === obtener(a, b - 1)) racha += 1;
        else {
          if (racha >= 5) total += racha - 2;
          racha = 1;
        }
      }
      for (let b = 0; b + 10 < tam; b += 1) {
        const patron = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
        const coincide = (p) => p.every((v, k) => Number(obtener(a, b + k)) === v);
        if (coincide(patron) || coincide([...patron].reverse())) total += 40;
      }
    }
  };
  lineas((f, c) => m[f][c]);
  lineas((c, f) => m[f][c]);
  for (let f = 0; f + 1 < tam; f += 1) {
    for (let c = 0; c + 1 < tam; c += 1) {
      const v = m[f][c];
      if (v === m[f + 1][c] && v === m[f][c + 1] && v === m[f + 1][c + 1]) total += 3;
    }
  }
  const oscuros = m.flat().filter(Boolean).length;
  total += Math.floor(Math.abs((oscuros * 20) / (tam * tam) - 10)) * 10;
  return total;
};

export const crearQR = (texto) => {
  const bytes = bytesUTF8(texto);
  const version = elegirVersion(bytes.length);
  const datos = codewords(bytes, version);
  const { tam, m, fija } = matrizBase(version);
  colocarDatos(m, fija, tam, datos);

  let mejor = null;
  MASCARAS.forEach((mascara, n) => {
    const copia = m.map((fila, f) => fila.map((v, c) => (fija[f][c] ? v : v !== mascara(f, c))));
    ponerFormato(copia, tam, n);
    const puntos = penalizacion(copia, tam);
    if (!mejor || puntos < mejor.puntos) mejor = { puntos, modulos: copia };
  });
  return { tamano: tam, version, modulos: mejor.modulos };
};

/** Ruta SVG con un cuadrado de 1×1 por cada módulo oscuro (añade el margen con el viewBox). */
export const qrComoRutaSVG = ({ modulos }) =>
  modulos.flatMap((fila, f) => fila.map((v, c) => (v ? `M${c} ${f}h1v1h-1z` : ''))).join('');
