/**
 * Carga los datos de demostración en MongoDB.
 * ¡Borra la base de datos entera y la vuelve a crear! Úsalo solo en desarrollo.
 *   npm run datos
 */
import { conectarBaseDatos, desconectarBaseDatos } from '../src/configuracion/baseDatos.js';
import { ES_PRODUCCION } from '../src/configuracion/entorno.js';
import { cargarDatosDemo } from '../src/servicios/datosDemo.servicio.js';

const cargar = async () => {
  if (ES_PRODUCCION) throw new Error('El script de demo no se ejecuta en producción.');
  await conectarBaseDatos();
  const contrasena = await cargarDatosDemo();
  console.log(`[igs] Datos de demo cargados. Contraseña de todas las cuentas: ${contrasena}`);
};

cargar()
  .catch((error) => {
    console.error('[igs] Error al cargar los datos:', error.message);
    process.exitCode = 1;
  })
  .finally(desconectarBaseDatos);
