/**
 * Copia de seguridad en JSON sin programas externos (solo Node + Mongoose).
 * Se usa cuando no están instaladas las MongoDB Database Tools.
 * Formato: un archivo .json.gz con todas las colecciones en Extended JSON, que conserva
 * los tipos de MongoDB (ObjectId, fechas…). También se puede abrir y leer descomprimido.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import mongoose from 'mongoose';

const { EJSON } = mongoose.mongo.BSON;

const nombresColecciones = async (db) =>
  (await db.listCollections({}, { nameOnly: true }).toArray())
    .map((coleccion) => coleccion.name)
    .filter((nombre) => !nombre.startsWith('system.'));

/** Guarda todas las colecciones de la base de datos en un archivo .json.gz. Devuelve el nº de documentos. */
export const exportarJson = async (db, archivo) => {
  const colecciones = {};
  for (const nombre of await nombresColecciones(db)) {
    colecciones[nombre] = await db.collection(nombre).find().toArray();
  }
  const copia = { baseDatos: db.databaseName, fecha: new Date(), colecciones };
  await writeFile(archivo, gzipSync(EJSON.stringify(copia, null, 2, { relaxed: false })));
  return Object.values(colecciones).reduce((total, documentos) => total + documentos.length, 0);
};

/** Vacía cada colección de la copia y vuelve a meter sus documentos (mantiene los índices). */
export const importarJson = async (db, archivo) => {
  const { colecciones } = EJSON.parse(gunzipSync(await readFile(archivo)).toString('utf8'), { relaxed: false });
  for (const [nombre, documentos] of Object.entries(colecciones)) {
    await db.collection(nombre).deleteMany({});
    if (documentos.length) await db.collection(nombre).insertMany(documentos);
    console.log(`[igs-copia]   ${nombre}: ${documentos.length} documentos`);
  }
};
