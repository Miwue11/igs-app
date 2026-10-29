import { esInterno } from '@compartido';

/** Rutas de la aplicación (un solo sitio para cambiarlas). */
export const RUTAS = Object.freeze({
  INICIO: '/',
  SERVICIOS: '/servicios',
  CONSULTA: '/consulta',
  ACCEDER: '/acceder',
  CONTACTO: '/contacto',
  MI_CUENTA: '/mi-cuenta',
  PANEL: '/panel',
});

export const rutaConsulta = (idCertificado) => `${RUTAS.CONSULTA}?id=${encodeURIComponent(idCertificado)}`;

/** Adónde va cada usuario al entrar: el personal al panel, los clientes a su cuenta. */
export const rutaInicioDe = (rol) => (esInterno(rol) ? RUTAS.PANEL : RUTAS.MI_CUENTA);

export const rutaAcceder =(volver) => (volver ? `${RUTAS.ACCEDER}?volver=${encodeURIComponent(volver)}` : RUTAS.ACCEDER);
