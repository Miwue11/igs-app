import { ROLES, ROLES_INTERNOS } from '@compartido';
import { RUTAS } from '../constantes/rutas.js';
import { PaginaInicio } from '../paginas/PaginaInicio.jsx';
import { PaginaServicios } from '../paginas/PaginaServicios.jsx';
import { PaginaConsulta } from '../paginas/PaginaConsulta.jsx';
import { PaginaAcceder } from '../paginas/PaginaAcceder.jsx';
import { PaginaContacto } from '../paginas/PaginaContacto.jsx';
import { PaginaMiCuenta } from '../paginas/PaginaMiCuenta.jsx';
import { PaginaPanel } from '../paginas/PaginaPanel.jsx';
import { PaginaLegal } from '../paginas/PaginaLegal.jsx';

/**
 * Qué página se pinta en cada ruta, con qué plantilla y quién puede entrar.
 * roles: null = pública · [] = cualquier usuario con sesión · [roles] = solo esos roles.
 */
export const TABLA_RUTAS = Object.freeze([
  { ruta: RUTAS.INICIO, Pagina: PaginaInicio, plantilla: 'publica', roles: null },
  { ruta: RUTAS.SERVICIOS, Pagina: PaginaServicios, plantilla: 'publica', roles: null },
  { ruta: RUTAS.CONSULTA, Pagina: PaginaConsulta, plantilla: 'publica', roles: null },
  { ruta: RUTAS.ACCEDER, Pagina: PaginaAcceder, plantilla: 'publica', roles: null },
  { ruta: RUTAS.CONTACTO, Pagina: PaginaContacto, plantilla: 'publica', roles: null },
  { ruta: RUTAS.MI_CUENTA, Pagina: PaginaMiCuenta, plantilla: 'publica', roles: [ROLES.CLIENTE] },
  { ruta: RUTAS.LEGAL, Pagina: PaginaLegal, plantilla: 'publica', roles: null },
  { ruta: RUTAS.PANEL, Pagina: PaginaPanel, plantilla: 'panel', roles: ROLES_INTERNOS },
]);
