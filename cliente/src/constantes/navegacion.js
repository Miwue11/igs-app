import { ROLES, ROLES_INTERNOS } from '@compartido';
import { RUTAS } from './rutas.js';

export const MENU_PRINCIPAL = Object.freeze([
  { ruta: RUTAS.INICIO, texto: 'Inicio' },
  { ruta: RUTAS.SERVICIOS, texto: 'Servicios' },
  { ruta: RUTAS.CONSULTA, texto: 'Consultar ID' },
  { ruta: RUTAS.CONTACTO, texto: 'Contacto' },
]);

export const ENLACES_LEGALES = Object.freeze([
  { ruta: RUTAS.CONTACTO, texto: 'Contacto' },
  { ruta: '#', texto: 'Aviso legal' },
  { ruta: '#', texto: 'Privacidad' },
  { ruta: '#', texto: 'Cookies' },
]);

/** Secciones del panel interno y qué roles las ven. */
export const SECCIONES_PANEL = Object.freeze([
  { id: 'cola', texto: 'Cola de pedidos', roles: ROLES_INTERNOS },
  { id: 'subir', texto: 'Gradear artículos', roles: ROLES_INTERNOS },
  { id: 'tickets', texto: 'Tickets de ayuda', roles: ROLES_INTERNOS },
  { id: 'usuarios', texto: 'Usuarios', roles: [ROLES.ADMIN], soloAdmin: true },
]);

export const SECCION_PANEL_INICIAL = 'cola';
