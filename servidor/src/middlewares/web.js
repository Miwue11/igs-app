import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import express from 'express';
import { ENTORNO } from '../configuracion/entorno.js';

/** Rutas que no son de la web: las gestiona la API o la carpeta de fotos. */
const NO_ES_WEB = /^\/(api|fotos)(\/|$)/;

/**
 * Si existe la web compilada (cliente/dist), Express la sirve en el mismo puerto que la API.
 * Así basta con reenviar un solo puerto en VS Code y no hace falta Apache.
 */
export const servirWeb = (aplicacion) => {
  const carpeta = resolve(ENTORNO.CARPETA_WEB);
  const indice = join(carpeta, 'index.html');
  if (!existsSync(indice)) return;

  aplicacion.use(express.static(carpeta, { index: false, maxAge: '1h' }));
  aplicacion.get('*', (req, res, next) => (NO_ES_WEB.test(req.path) ? next() : res.sendFile(indice)));
  console.log(`[igs] Sirviendo la web compilada desde ${carpeta}`);
};
