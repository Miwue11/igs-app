/**
 * Copia de seguridad de la base de datos (gratuita).
 *   npm run copia
 * 1) Crea la copia en servidor/copias/:
 *    - con mongodump si están instaladas las MongoDB Database Tools  → igs_<fecha>.archive.gz
 *    - si no, en JSON con el propio Node (no hace falta instalar nada) → igs_<fecha>.json.gz
 * 2) La copia a COPIA_FISICA (pendrive o disco externo) → copia física.
 * 3) La copia a COPIA_NUBE (carpeta sincronizada con Google Drive u OneDrive) → copia en la nube.
 * Se puede programar con el Programador de tareas de Windows o con cron en Linux.
 * Restaurar:  npm run restaurar -- <archivo>
 */
import { spawn } from 'node:child_process';
import { copyFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import mongoose from 'mongoose';
import { ENTORNO } from '../src/configuracion/entorno.js';
import { buscarHerramienta } from './utilidades/herramientasMongo.js';
import { exportarJson } from './utilidades/copiaJson.js';

const CARPETA_LOCAL = resolve('copias');
const DIAS_RETENCION = 14;
const DIA_MS = 24 * 60 * 60 * 1000;

const fechaArchivo = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

const ejecutar = (programa, argumentos) => new Promise((terminado, fallo) => {
  const proceso = spawn(programa, argumentos, { stdio: 'inherit' });
  proceso.on('error', fallo);
  proceso.on('close', (codigo) => (codigo === 0 ? terminado() : fallo(new Error(`${programa} terminó con el código ${codigo}.`))));
});

const copiaConMongodump = async (mongodump) => {
  const archivo = join(CARPETA_LOCAL, `igs_${fechaArchivo()}.archive.gz`);
  await ejecutar(mongodump, [`--uri=${ENTORNO.URI_MONGODB}`, `--archive=${archivo}`, '--gzip']);
  return archivo;
};

const copiaEnJson = async () => {
  console.log('[igs-copia] No están instaladas las MongoDB Database Tools: la copia se hace en JSON con Node.');
  const archivo = join(CARPETA_LOCAL, `igs_${fechaArchivo()}.json.gz`);
  await mongoose.connect(ENTORNO.URI_MONGODB, { serverSelectionTimeoutMS: 4000 });
  try {
    const documentos = await exportarJson(mongoose.connection.db, archivo);
    console.log(`[igs-copia] ${documentos} documentos guardados.`);
  } finally {
    await mongoose.disconnect();
  }
  return archivo;
};

const copiarA = async (destino, origen, tipo) => {
  if (!destino) return console.log(`[igs-copia] Sin carpeta para la copia ${tipo} (rellena ${tipo === 'física' ? 'COPIA_FISICA' : 'COPIA_NUBE'} en servidor/.env).`);
  await mkdir(destino, { recursive: true });
  const copia = join(destino, origen.split(/[\\/]/).pop());
  await copyFile(origen, copia);
  console.log(`[igs-copia] Copia ${tipo}: ${copia}`);
};

const borrarAntiguas = async () => {
  const limite = Date.now() - DIAS_RETENCION * DIA_MS;
  for (const archivo of await readdir(CARPETA_LOCAL)) {
    const ruta = join(CARPETA_LOCAL, archivo);
    if (archivo.startsWith('igs_') && (await stat(ruta)).mtimeMs < limite) await rm(ruta);
  }
};

const copiar = async () => {
  await mkdir(CARPETA_LOCAL, { recursive: true });
  const mongodump = buscarHerramienta('mongodump');
  const archivo = mongodump ? await copiaConMongodump(mongodump) : await copiaEnJson();
  console.log(`[igs-copia] Copia creada: ${archivo}`);
  await copiarA(ENTORNO.COPIA_FISICA, archivo, 'física');
  await copiarA(ENTORNO.COPIA_NUBE, archivo, 'en la nube');
  await borrarAntiguas();
};

copiar().catch((error) => {
  console.error(`[igs-copia] ${error.message}`);
  process.exitCode = 1;
});
