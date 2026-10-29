/** Contenido fijo de la web. Los datos entre corchetes los rellena la empresa. */
export const PASOS_PROCESO = Object.freeze([
  { numero: '01', titulo: 'Crea tu cuenta', texto: 'Regístrate para hacer pedidos y seguir su estado.' },
  { numero: '02', titulo: 'Haz tu pedido', texto: 'Elige el servicio y añade los productos a gradear.' },
  { numero: '03', titulo: 'Envíanos tus productos', texto: 'Se gradean en 14 días como máximo (menos con Express o Premium).' },
  { numero: '04', titulo: 'Consulta tu certificado', texto: 'Cada producto recibe un ID público con su ficha completa.' },
]);

export const DATOS_CONTACTO = Object.freeze([
  { titulo: 'Dirección', valor: '[DIRECCIÓN]' },
  { titulo: 'Horario', valor: '[HORARIO]' },
  { titulo: 'Email', valor: '[EMAIL]' },
  { titulo: 'Teléfono', valor: '[TELÉFONO]' },
]);

export const TEXTO_PIE = '© 2026 IGS · Iberian Grading Services — empresa ficticia, proyecto académico';

/** Servicios que se resumen en la página de inicio. */
export const SERVICIOS_PORTADA = Object.freeze(['STD', 'EXP', 'BLQ']);
