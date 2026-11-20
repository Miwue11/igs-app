import { ENTORNO } from './configuracion/entorno.js';
import { conectarBaseDatos } from './configuracion/baseDatos.js';
import { crearAplicacion } from './aplicacion.js';
import { cargarDatosDemoSiVacia } from './servicios/datosDemo.servicio.js';
import { sincronizarCatalogoSiVacio } from './servicios/cartasCatalogo.servicio.js';

const arrancar = async () => {
  await conectarBaseDatos();
  if (ENTORNO.SEMBRAR_DEMO_SI_VACIA) await cargarDatosDemoSiVacia();
  crearAplicacion().listen(ENTORNO.PUERTO, () => {
    console.log(`[igs] API escuchando en el puerto ${ENTORNO.PUERTO} (/api)`);
  });
  await sincronizarCatalogoSiVacio();
};

arrancar().catch((error) => {
  console.error('[igs] No se pudo arrancar el servidor:', error.message);
  process.exit(1);
});
