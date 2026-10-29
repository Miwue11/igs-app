/**
 * Busca las MongoDB Database Tools (mongodump, mongorestore) en el ordenador.
 * Orden: carpeta RUTA_HERRAMIENTAS_MONGO del .env → PATH → C:\Program Files\MongoDB\Tools\<versión>\bin
 * Si no están instaladas devuelve null y la copia se hace en JSON con el propio Node.
 */
import { existsSync, readdirSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { ENTORNO } from '../../src/configuracion/entorno.js';

const ES_WINDOWS = process.platform === 'win32';
const CARPETA_TOOLS_WINDOWS = 'C:\\Program Files\\MongoDB\\Tools';

const ejecutable = (nombre) => (ES_WINDOWS ? `${nombre}.exe` : nombre);

const carpetasDelPath = () => (process.env.PATH ?? '').split(delimiter).filter(Boolean);

/** Carpetas bin de cada versión instalada en Windows (la más nueva primero). */
const carpetasWindows = () => {
  if (!ES_WINDOWS || !existsSync(CARPETA_TOOLS_WINDOWS)) return [];
  return readdirSync(CARPETA_TOOLS_WINDOWS).sort().reverse().map((version) => join(CARPETA_TOOLS_WINDOWS, version, 'bin'));
};

export const buscarHerramienta = (nombre) => {
  const carpetas = [ENTORNO.RUTA_HERRAMIENTAS_MONGO, ...carpetasDelPath(), ...carpetasWindows()].filter(Boolean);
  const encontrada = carpetas.map((carpeta) => join(carpeta, ejecutable(nombre))).find((ruta) => existsSync(ruta));
  return encontrada ?? null;
};
