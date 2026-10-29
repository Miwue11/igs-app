const env = import.meta.env ?? {};

/** Configuración del cliente leída de las variables de entorno de Vite. */
export const CONFIGURACION = Object.freeze({
  URL_API: env.VITE_URL_API || '/api',
  MODO_DEMO: env.VITE_MODO_DEMO === 'true',
  RETARDO_DEMO_MS: 250,
});
