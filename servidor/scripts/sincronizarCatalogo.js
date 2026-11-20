/**
 * Descarga (o actualiza) el catálogo de cartas de CardTrader en MongoDB.
 * Necesita CARDTRADER_TOKEN en el .env. Se puede repetir: no duplica cartas.
 *   npm run catalogo -w servidor
 */
import { conectarBaseDatos, desconectarBaseDatos } from '../src/configuracion/baseDatos.js';
import { sincronizarCardTrader } from '../src/servicios/cartasCatalogo.servicio.js';

const sincronizar = async () => {
  await conectarBaseDatos();
  const inicio = Date.now();
  const { juegos, cartas } = await sincronizarCardTrader();
  console.log(`[igs] Listo en ${Math.round((Date.now() - inicio) / 1000)} s: ${cartas} cartas de ${juegos} juegos.`);
};

sincronizar()
  .catch((error) => {
    console.error('[igs] Error al sincronizar el catálogo:', error.message);
    process.exitCode = 1;
  })
  .finally(desconectarBaseDatos);
