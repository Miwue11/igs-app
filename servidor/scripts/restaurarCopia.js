/**
 * Restaura una copia de seguridad hecha con «npm run copia».
 *   npm run restaurar                     → lista las copias de servidor/copias/
 *   npm run restaurar -- <archivo>        → restaura esa copia (reemplaza los datos actuales)
 * Admite las dos clases de copia: .archive.gz (mongorestore) y .json.gz (JSON con Node).
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import mongoose from 'mongoose';
import { ENTORNO } from '../src/configuracion/entorno.js';
import { buscarHerramienta } from './utilidades/herramientasMongo.js';
import { importarJson } from './utilidades/copiaJson.js';

const CARPETA_LOCAL = resolve('copias');

const listarCopias = async () => {
  const copias = existsSync(CARPETA_LOCAL) ? (await readdir(CARPETA_LOCAL)).filter((a) => a.startsWith('igs_')) : [];
  console.log(copias.length ? '[igs-copia] Copias disponibles:' : '[igs-copia] No hay copias en servidor/copias/.');
  copias.sort().reverse().forEach((copia) => console.log(`  copias/${copia}`));
  if (copias.length) console.log('Uso: npm run restaurar -- copias/<archivo>');
};

const restaurarArchive = (archivo) => new Promise((terminado, fallo) => {
  const mongorestore = buscarHerramienta('mongorestore');
  if (!mongorestore) return fallo(new Error('Esta copia necesita mongorestore (MongoDB Database Tools).'));
  const proceso = spawn(mongorestore, [`--uri=${ENTORNO.URI_MONGODB}`, `--archive=${archivo}`, '--gzip', '--drop'], { stdio: 'inherit' });
  proceso.on('error', fallo);
  proceso.on('close', (codigo) => (codigo === 0 ? terminado() : fallo(new Error(`mongorestore terminó con el código ${codigo}.`))));
});

const restaurarJson = async (archivo) => {
  await mongoose.connect(ENTORNO.URI_MONGODB, { serverSelectionTimeoutMS: 4000 });
  try {
    await importarJson(mongoose.connection.db, archivo);
  } finally {
    await mongoose.disconnect();
  }
};

const restaurar = async ([indicado]) => {
  if (!indicado) return listarCopias();
  const archivo = resolve(indicado);
  if (!existsSync(archivo)) throw new Error(`No existe el archivo ${archivo}`);
  console.log(`[igs-copia] Restaurando ${archivo} en ${ENTORNO.URI_MONGODB}…`);
  await (archivo.endsWith('.json.gz') ? restaurarJson(archivo) : restaurarArchive(archivo));
  console.log('[igs-copia] Copia restaurada.');
};

restaurar(process.argv.slice(2)).catch((error) => {
  console.error(`[igs-copia] ${error.message}`);
  process.exitCode = 1;
});
