/** Contenido fijo de la web. Los datos entre corchetes los rellena la empresa. */
export const PASOS_PROCESO = Object.freeze([
  { numero: '01', titulo: 'Crea tu cuenta', texto: 'Regístrate para hacer pedidos y seguir su estado.' },
  { numero: '02', titulo: 'Haz tu pedido', texto: 'Elige el servicio y añade cada carta con su valor declarado.' },
  { numero: '03', titulo: 'Envíanos tus productos', texto: 'Desde que llegan a IGS, se gradean en 14 días como máximo (7 con Express y 3 con Premium).' },
  { numero: '04', titulo: 'Consulta tu certificado', texto: 'Cada producto recibe un ID público con su ficha completa.' },
]);

/** Datos de contacto de ejemplo (IGS es ficticia: el dominio .example y el teléfono 900 000 000 no existen). */
export const DATOS_CONTACTO = Object.freeze([
  { titulo: 'Dirección de envíos', valor: 'IGS · Recepción\nCalle del Ejemplo 1\n29000 Málaga' },
  { titulo: 'Horario', valor: 'Lunes a viernes\n9:00 – 18:00' },
  { titulo: 'Email', valor: 'hola@igs.example', enlace: 'mailto:hola@igs.example' },
  { titulo: 'Teléfono', valor: '+34 900 000 000', enlace: 'tel:+34900000000' },
]);

/** Garantías que se resumen bajo la portada. */
export const VENTAJAS_CONFIANZA = Object.freeze([
  { icono: 'reloj', titulo: '14 días garantizados', texto: 'Desde que recibimos tu paquete. 7 con Express y 3 con Premium.' },
  { icono: 'qr', titulo: 'Ficha pública verificable', texto: 'Cada etiqueta lleva un ID y un QR que abren las fotos y las subnotas.' },
  { icono: 'uv', titulo: 'Código UV anti-réplica', texto: 'Una firma invisible a simple vista que solo IGS puede generar.' },
]);

/** Preguntas frecuentes (portada y contacto). */
export const PREGUNTAS_FRECUENTES = Object.freeze([
  {
    pregunta: '¿Desde cuándo cuentan los 14 días?',
    respuesta: 'Desde que tu paquete llega a IGS y lo marcamos como recibido, no desde que haces el pedido. En Mi cuenta verás la fecha límite exacta de cada pedido en cuanto lo recibamos.',
  },
  {
    pregunta: '¿Qué pasa si no se cumple el plazo?',
    respuesta: 'Si publicamos un pedido fuera de plazo, te devolvemos el importe del gradeo de ese pedido. Solo pagas el envío de vuelta.',
  },
  {
    pregunta: '¿Cómo preparo el envío?',
    respuesta: 'Cada carta en su funda y en una funda semirrígida, todas juntas en una caja con relleno y una hoja con el código de pedido. Envíalo asegurado por el valor total declarado.',
  },
  {
    pregunta: '¿Qué valor tengo que declarar?',
    respuesta: 'El valor de mercado de cada artículo. Sirve para el seguro y tiene que caber en el máximo del servicio (500 € en el Estándar, 1.500 € en el Express y sin límite en el Premium).',
  },
  {
    pregunta: '¿Cómo sé que un slab de IGS es auténtico?',
    respuesta: 'Busca el ID o escanea el QR: la ficha debe mostrar las mismas fotos y datos. Después ilumina la trasera con luz UV y comprueba el código de 8 caracteres en la ficha.',
  },
  {
    pregunta: '¿Y si una carta no se puede gradear?',
    respuesta: 'Si está alterada, recortada o tiene un tamaño no estándar, la marcamos como no gradeable con el motivo y te la devolvemos sin encapsular junto al resto del pedido.',
  },
]);

export const TEXTO_PIE = '© 2026 IGS · Iberian Grading Services — empresa ficticia, proyecto académico';

/** Servicios que se resumen en la página de inicio. */
export const SERVICIOS_PORTADA = Object.freeze(['STD', 'EXP', 'PRE']);
