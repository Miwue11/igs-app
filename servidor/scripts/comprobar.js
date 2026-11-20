/**
 * Comprueba la conexión con MongoDB y cuenta los documentos de cada colección.
 *   npm run comprobar
 */
import { conectarBaseDatos, desconectarBaseDatos } from '../src/configuracion/baseDatos.js';
import { ENTORNO } from '../src/configuracion/entorno.js';
import { Usuario, Servicio, Pedido, Producto, Ticket, CartaCatalogo } from '../src/modelos/index.js';

const MODELOS = {
  usuarios: Usuario, servicios: Servicio, pedidos: Pedido, productos: Producto, tickets: Ticket, catalogo_cartas: CartaCatalogo,
};

/** La URI lleva usuario y contraseña: se muestra sin la contraseña. */
const uriSinContrasena = (uri) => uri.replace(/\/\/([^:/@]+):.*@/, '//$1:****@');

const comprobar = async () => {
  console.log(`[igs] Conectando a ${uriSinContrasena(ENTORNO.URI_MONGODB)} ...`);
  await conectarBaseDatos();
  for (const [nombre, modelo] of Object.entries(MODELOS)) {
    console.log(`  ${nombre.padEnd(15)} ${await modelo.countDocuments()} documentos`);
  }
  console.log('[igs] Todo correcto. Si las colecciones están a 0, ejecuta: npm run datos');
};

comprobar()
  .catch((error) => {
    console.error(`[igs] No se pudo conectar: ${error.message}`);
    console.error('      ¿Está instalado y arrancado MongoDB Community Server? Compass solo es el visor.');
    process.exitCode = 1;
  })
  .finally(desconectarBaseDatos);
