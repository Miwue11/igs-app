/** Une nombres de clase CSS ignorando los vacíos: clases('btn', activo && 'on'). */
export const clases = (...nombres) => nombres.filter(Boolean).join(' ');
