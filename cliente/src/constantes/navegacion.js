import { ROLES, ROLES_INTERNOS } from '@compartido';
import { RUTAS } from './rutas.js';

export const MENU_PRINCIPAL = Object.freeze([
  { ruta: RUTAS.INICIO, texto: 'Inicio' },
  { ruta: RUTAS.SERVICIOS, texto: 'Servicios' },
  { ruta: RUTAS.CONSULTA, texto: 'Consultar ID' },
  { ruta: RUTAS.CONTACTO, texto: 'Contacto' },
]);

export const ENLACES_LEGALES = Object.freeze([
  { ruta: `${RUTAS.LEGAL}?seccion=aviso-legal`, texto: 'Aviso legal' },
  { ruta: `${RUTAS.LEGAL}?seccion=privacidad`, texto: 'Privacidad' },
  { ruta: `${RUTAS.LEGAL}?seccion=cookies`, texto: 'Cookies' },
]);

/** Columnas del pie de página. */
export const COLUMNAS_PIE = Object.freeze([
  {
    titulo: 'Servicios',
    enlaces: [
      { ruta: RUTAS.SERVICIOS, texto: 'Gradeo Estándar, Express y Premium' },
      { ruta: RUTAS.SERVICIOS, texto: 'Gradeo de cómics' },
      { ruta: RUTAS.SERVICIOS, texto: 'Segunda opinión' },
    ],
  },
  {
    titulo: 'Certificados',
    enlaces: [
      { ruta: RUTAS.CONSULTA, texto: 'Verificar un ID' },
      { ruta: `${RUTAS.INICIO}#t-etiquetas`, texto: 'Cómo leer la etiqueta' },
      { ruta: `${RUTAS.CONTACTO}#preguntas`, texto: 'Preguntas frecuentes' },
    ],
  },
  {
    titulo: 'Ayuda',
    enlaces: [
      { ruta: RUTAS.CONTACTO, texto: 'Contacto y tickets' },
      { ruta: RUTAS.MI_CUENTA, texto: 'Mis pedidos' },
    ],
  },
]);

/** Secciones del panel interno y qué roles las ven. */
export const SECCIONES_PANEL = Object.freeze([
  { id: 'cola', texto: 'Cola de pedidos', roles: ROLES_INTERNOS },
  { id: 'subir', texto: 'Gradear artículos', roles: ROLES_INTERNOS },
  { id: 'tickets', texto: 'Tickets de ayuda', roles: ROLES_INTERNOS },
  { id: 'usuarios', texto: 'Usuarios', roles: [ROLES.ADMIN], soloAdmin: true },
]);

export const SECCION_PANEL_INICIAL = 'cola';
