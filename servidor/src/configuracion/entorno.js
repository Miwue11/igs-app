import 'dotenv/config';

const leer = (clave, porDefecto) => process.env[clave] ?? porDefecto;
const activado = (clave) => leer(clave, 'false') === 'true';

/** Configuración del servidor leída de .env (un único punto de acceso). */
export const ENTORNO = Object.freeze({
  NODE_ENV: leer('NODE_ENV', 'development'),
  // Render (y otros servicios) indican el puerto en PORT.
  PUERTO: Number(process.env.PORT ?? leer('PUERTO', 4000)),
  URI_MONGODB: leer('URI_MONGODB', 'mongodb://localhost:27017/igs'),
  SECRETO_JWT: leer('SECRETO_JWT', ''),
  ORIGEN_CLIENTE: leer('ORIGEN_CLIENTE', 'http://localhost:5173'),
  CARPETA_FOTOS: leer('CARPETA_FOTOS', 'fotos'),
  // true → las fotos se guardan dentro de MongoDB (necesario en Render, cuyo disco no es permanente).
  FOTOS_EN_MONGO: activado('FOTOS_EN_MONGO'),
  // true → si la base de datos está vacía al arrancar, se cargan los datos de demo.
  SEMBRAR_DEMO_SI_VACIA: activado('SEMBRAR_DEMO_SI_VACIA'),
  CARPETA_WEB: leer('CARPETA_WEB', '../cliente/dist'),
  COPIA_FISICA: leer('COPIA_FISICA', ''),
  COPIA_NUBE: leer('COPIA_NUBE', ''),
  RUTA_HERRAMIENTAS_MONGO: leer('RUTA_HERRAMIENTAS_MONGO', ''),
  ANTHROPIC_API_KEY: leer('ANTHROPIC_API_KEY', ''),
  MODELO_IA: leer('MODELO_IA', 'claude-haiku-4-5'),
});

export const ES_PRODUCCION = ENTORNO.NODE_ENV === 'production';

if (!ENTORNO.SECRETO_JWT) {
  if (ES_PRODUCCION) throw new Error('Falta SECRETO_JWT en el archivo .env');
  console.warn('[igs] SECRETO_JWT vacío: solo válido para desarrollo.');
}
