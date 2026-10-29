/** Perfiles de usuario del sistema. */
export const ROLES = Object.freeze({
  CLIENTE: 'cliente',
  TRABAJADOR: 'trabajador',
  ADMIN: 'admin',
});

/** Roles con acceso al panel interno. */
export const ROLES_INTERNOS = Object.freeze([ROLES.TRABAJADOR, ROLES.ADMIN]);

export const ETIQUETAS_ROL = Object.freeze({
  [ROLES.CLIENTE]: 'Cliente',
  [ROLES.TRABAJADOR]: 'Trabajador',
  [ROLES.ADMIN]: 'Administrador',
});

export const esInterno = (rol) => ROLES_INTERNOS.includes(rol);
