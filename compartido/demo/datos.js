/**
 * Datos de demostración. Los usa el script de carga (servidor/scripts/cargarDatos.js)
 * y el modo demo del cliente, así ambos muestran lo mismo.
 * Los precios son de ejemplo: ajústalos a la tarifa real.
 */
import { calcularFechaLimite } from '../utilidades/plazos.js';
import { pedidoNuevo, prepararArticulos } from '../utilidades/pedidos.js';
import { ESTADOS_ARTICULO } from '../constantes/negocio.js';

const DIA = 24 * 60 * 60 * 1000;
export const haceDias = (dias) => (dias === null ? null : new Date(Date.now() - dias * DIA).toISOString());

export const CONTRASENA_DEMO = 'Igs-demo-2026';

/**
 * Servicios por nivel de valor declarado, como PSA y BGS: cuanto más vale cada artículo,
 * más caro es el servicio, más rápido se publica y más prioridad tiene en la cola.
 * El plazo cuenta desde que llega el paquete. El envío de vuelta asegurado se suma aparte.
 */
export const DEMO_SERVICIOS = [
  { codigo: 'STD', nombre: 'Gradeo Estándar', categoria: 'tcg', descripcion: 'Evaluación completa, encapsulado y ficha pública con fotos y subnotas.', plazoDias: 14, prioridad: 0, extras: [], valorMax: 500, minimoUnidades: 1, precio: 15, destacado: false, orden: 1 },
  { codigo: 'EXP', nombre: 'Gradeo Express', categoria: 'tcg', descripcion: 'La mitad de plazo y preferencia en la cola de gradeo.', plazoDias: 7, prioridad: 1, extras: [], valorMax: 1500, minimoUnidades: 1, precio: 35, destacado: true, orden: 2 },
  { codigo: 'PRE', nombre: 'Gradeo Premium', categoria: 'deportivas', descripcion: 'Para piezas de alto valor: el plazo más corto y revisión por dos gradeadores.', plazoDias: 3, prioridad: 2, extras: ['Doble revisión'], valorMax: null, minimoUnidades: 1, precio: 80, destacado: false, orden: 3 },
  { codigo: 'COM', nombre: 'Gradeo de cómics', categoria: 'comics', descripcion: 'Evaluación de portada, lomo y páginas interiores.', plazoDias: 14, prioridad: 0, extras: [], valorMax: 1000, minimoUnidades: 1, precio: 25, destacado: false, orden: 4 },
  { codigo: 'REG', nombre: 'Regradeo', categoria: 'tcg', descripcion: 'Nueva evaluación de un producto ya encapsulado por IGS u otra empresa.', plazoDias: 14, prioridad: 0, extras: [], valorMax: 500, minimoUnidades: 1, precio: 12, destacado: false, orden: 5 },
  { codigo: 'BLQ', nombre: 'Pedido en bloque', categoria: 'empresas', descripcion: 'Para tiendas y grandes colecciones: mínimo 20 artículos de hasta 200 € cada uno, a precio reducido.', plazoDias: 14, prioridad: 0, extras: ['Seguimiento por lote', 'Mínimo 20 artículos'], valorMax: 200, minimoUnidades: 20, precio: 10, destacado: false, orden: 6 },
];

export const DEMO_USUARIOS = [
  { nombre: 'Administración IGS', email: 'admin@igs.demo', rol: 'admin' },
  { nombre: 'Equipo de gradeo', email: 'trabajador@igs.demo', rol: 'trabajador' },
  { nombre: 'Cliente de prueba', email: 'cliente@igs.demo', rol: 'cliente' },
  { nombre: 'Tienda de prueba', email: 'tienda@igs.demo', rol: 'cliente' },
];

const carta = (nombre, expansion, anio, numero, valorDeclarado, extra = {}) =>
  ({ nombre, marca: 'Pokémon', expansion, anio, numero, idioma: 'Inglés', valorDeclarado, ...extra });

const CARTAS_COLECCION = [
  carta('Pikachu', 'Base Set', 1999, '58/102', 40),
  carta('Blastoise', 'Base Set', 1999, '2/102', 180),
  carta('Venusaur', 'Base Set', 1999, '15/102', 150),
  carta('Mewtwo', 'Base Set', 1999, '10/102', 120),
  carta('Gengar', 'Fossil', 1999, '5/62', 90),
  carta('Dragonite', 'Fossil', 1999, '4/62', 110),
  carta('Umbreon VMAX', 'Evolving Skies', 2021, '215/203', 450),
  carta('Rayquaza VMAX', 'Evolving Skies', 2021, '218/203', 380),
  carta('Lugia V', 'Silver Tempest', 2022, '186/195', 160),
  carta('Giratina V', 'Lost Origin', 2022, '186/196', 300),
  carta('Mew ex', '151', 2023, '205/165', 70),
  carta('Charizard ex', 'Obsidian Flames', 2023, '223/197', 95),
];

/** Lote de una tienda: artículos sencillos con un valor declarado bajo. */
const loteTienda = (cantidad) =>
  Array.from({ length: cantidad }, (_, i) => carta(`Carta del lote ${i + 1}`, 'Scarlet & Violet', 2023, `${(i % 198) + 1}/198`, 15));

/**
 * llegada / creado / publicado: hace cuántos días ocurrió (null = todavía no).
 * articulos: lo que declaró el cliente. idCertificado = ya gradeado; motivo = no gradeable.
 */
export const DEMO_PEDIDOS = [
  {
    codigo: 'PED-0001', cliente: 'cliente@igs.demo', servicio: 'STD', estado: 'en_gradeo', creado: 10, llegada: 6, publicado: null,
    articulos: CARTAS_COLECCION,
  },
  {
    codigo: 'PED-0002', cliente: 'cliente@igs.demo', servicio: 'EXP', estado: 'recibido', creado: 5, llegada: 4, publicado: null,
    articulos: [
      carta('Charizard', 'Base Set', 1999, '4/102', 1200),
      carta('Lugia', 'Neo Genesis', 2000, '9/111', 900),
      carta('Pikachu Illustrator', 'Promo', 1998, '—', 1400, { idioma: 'Japonés' }),
    ],
  },
  {
    codigo: 'PED-0003', cliente: 'tienda@igs.demo', servicio: 'BLQ', estado: 'recibido', creado: 9, llegada: 2, publicado: null,
    articulos: loteTienda(150),
  },
  {
    codigo: 'PED-0004', cliente: 'cliente@igs.demo', servicio: 'PRE', estado: 'pendiente_envio', creado: 1, llegada: null, publicado: null,
    articulos: [{ nombre: 'Delantero centro (rookie)', marca: 'Marca de ejemplo', expansion: 'Liga 2021-22', anio: 2021, numero: '23/200', idioma: 'Inglés', valorDeclarado: 2500 }],
  },
  {
    codigo: 'PED-0005', cliente: 'tienda@igs.demo', servicio: 'STD', estado: 'pendiente_envio', creado: 1, llegada: null, publicado: null,
    articulos: CARTAS_COLECCION.slice(0, 6),
  },
  {
    codigo: 'PED-0006', cliente: 'cliente@igs.demo', servicio: 'STD', estado: 'completado', creado: 45, llegada: 40, publicado: 32,
    articulos: [
      { ...carta('Marshadow & Machamp GX', 'Double Blaze', 2019, '101/095', 300, { idioma: 'Japonés' }), idCertificado: 'IGS-2026-000001' },
      { ...carta('Delantero centro', 'Liga 2021-22', 2021, '23/200', 60, { marca: 'Marca de ejemplo' }), idCertificado: 'IGS-2026-000002' },
      { ...carta('Charizard', 'Base Set', 1999, '4/102', 450), idCertificado: 'IGS-2026-000003' },
      { ...carta('Blastoise', 'Base Set', 1999, '2/102', 120), motivo: 'Posible falsificación' },
    ],
  },
];

/** Artículo de demo con su estado según lo que ya se ha hecho con él. */
const articuloDemo = ({ idCertificado = null, motivo = '', ...a }) => ({
  ...prepararArticulos([a])[0],
  idCertificado,
  motivo,
  estado: idCertificado ? ESTADOS_ARTICULO.GRADEADO : motivo ? ESTADOS_ARTICULO.NO_GRADEABLE : ESTADOS_ARTICULO.PENDIENTE,
});

/** Campos comunes de un pedido de demo (los usan el script de carga y el modo demo). */
export const construirPedidoDemo = (p, servicio) => {
  const articulos = p.articulos.map(articuloDemo);
  const llegada = haceDias(p.llegada);
  return {
    ...pedidoNuevo(servicio, articulos, haceDias(p.creado)),
    codigo: p.codigo,
    estado: p.estado,
    notas: '',
    fechaLlegada: llegada,
    fechaLimite: llegada ? calcularFechaLimite(llegada, servicio.plazoDias) : null,
    fechaPublicacion: haceDias(p.publicado),
  };
};

export const DEMO_PRODUCTOS = [
  {
    idCertificado: 'IGS-2026-000001', pedido: 'PED-0006', articulo: 0, nombre: 'Marshadow & Machamp GX', nota: 10,
    subnotas: { centrado: 10, esquinas: 10, bordes: 10, superficie: 10 },
    marca: 'Pokémon', anio: 2019, expansion: 'Double Blaze', clase: 'Tag Team GX', numeroTarjeta: '101/095',
    categoria: 'tcg', variedad: 'Secret Rare (SR)', idioma: 'Japonés', gradeado: 32,
    comentario: 'Centrado perfecto, esquinas y bordes sin desgaste y superficie sin marcas. Gradeo PRISTINE.',
    imagenes: { anverso: '/ejemplos/marshadow-machamp-gx.jpg', reverso: null, etiqueta: null },
  },
  {
    idCertificado: 'IGS-2026-000002', pedido: 'PED-0006', articulo: 1, nombre: 'Delantero centro', nota: 8,
    subnotas: { centrado: 8, esquinas: 7.5, bordes: 8, superficie: 8.5 },
    marca: 'Marca de ejemplo', anio: 2021, expansion: 'Liga 2021-22', clase: 'Base', numeroTarjeta: '23/200', categoria: 'deportivas',
    variedad: 'Rookie', idioma: 'Inglés', gradeado: 32,
    comentario: 'Esquinas con desgaste visible y bordes con pequeñas marcas de manipulación.',
  },
  {
    idCertificado: 'IGS-2026-000003', pedido: 'PED-0006', articulo: 2, nombre: 'Charizard', nota: 9.5,
    subnotas: { centrado: 9.5, esquinas: 9.5, bordes: 9.5, superficie: 10 },
    marca: 'Pokémon', anio: 1999, expansion: 'Base Set', clase: 'Rara holográfica', numeroTarjeta: '4/102',
    categoria: 'tcg', variedad: 'Holo · Unlimited', idioma: 'Inglés', gradeado: 33,
    comentario: 'Holo limpio y superficie excelente. Centrado 55/45, dentro del margen de GEM MINT.',
  },
];

export const DEMO_TICKETS = [
  { codigo: 'TCK-0001', cliente: 'cliente@igs.demo', tipo: 'pedido', referencia: 'PED-0002', mensaje: '¿Cuándo empezaréis a gradear mi pedido?', estado: 'abierto', creado: 1 },
];

export const DEMO_EJEMPLO_ID = DEMO_PRODUCTOS[0].idCertificado;
