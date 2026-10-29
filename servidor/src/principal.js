import { ENTORNO } from './configuracion/entorno.js';
import { conectarBaseDatos } from './configuracion/baseDatos.js';
import { crearAplicacion } from './aplicacion.js';

const arrancar = async () => {
  await conectarBaseDatos();
  crearAplicacion().listen(ENTORNO.PUERTO, () => {
    console.log(`[igs] API escuchando en http://localhost:${ENTORNO.PUERTO}/api`);
  });
};

arrancar().catch((error) => {
  console.error('[igs] No se pudo arrancar el servidor:', error.message);
  process.exit(1);
});
