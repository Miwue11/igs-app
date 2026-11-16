/**
 * Datos de demostración. Los usa el script de carga (servidor/scripts/cargarDatos.js)
 * y el modo demo del cliente, así ambos muestran lo mismo.
 * Los precios son de ejemplo: ajústalos a la tarifa real.
 */
import { calcularFechaLimite } from '../utilidades/plazos.js';
import { copiaServicio } from '../utilidades/pedidos.js';

const DIA = 24 * 60 * 60 * 1000;
export const haceDias = (dias) => (dias === null ? null : new Date(Date.now() - dias * DIA).toISOString());

export const CONTRASENA_DEMO = 'Igs-demo-2026';

/**
 * El gradeo básico tarda como máximo 14 días (desde que se crea el pedido hasta que se publica).
 * Los servicios superiores tienen menos días y más prioridad en la cola.
 */
export const DEMO_SERVICIOS = [
  { codigo: 'STD', nombre: 'Gradeo Estándar', categoria: 'tcg', descripcion: 'Evaluación completa, encapsulado y ficha pública con fotos y subnotas.', plazoDias: 14, prioridad: 0, extras: [], valorMax: 500, precio: 15, destacado: false, orden: 1 },
  { codigo: 'EXP', nombre: 'Gradeo Express', categoria: 'tcg', descripcion: 'La mitad de plazo y preferencia en la cola de gradeo.', plazoDias: 7, prioridad: 1, extras: [], valorMax: 1500, precio: 35, destacado: true, orden: 2 },
  { codigo: 'PRE', nombre: 'Gradeo Premium', categoria: 'deportivas', descripcion: 'Para piezas de alto valor: el plazo más corto y revisión por dos gradeadores.', plazoDias: 3, prioridad: 2, extras: ['Doble revisión'], valorMax: null, precio: 80, destacado: false, orden: 3 },
  { codigo: 'COM', nombre: 'Gradeo de cómics', categoria: 'comics', descripcion: 'Evaluación de portada, lomo y páginas interiores.', plazoDias: 14, prioridad: 0, extras: [], valorMax: 1000, precio: 25, destacado: false, orden: 4 },
  { codigo: 'REG', nombre: 'Regradeo', categoria: 'tcg', descripcion: 'Nueva evaluación de un producto ya encapsulado por IGS u otra empresa.', plazoDias: 14, prioridad: 0, extras: [], valorMax: 500, precio: 12, destacado: false, orden: 5 },
  { codigo: 'BLQ', nombre: 'Pedido en bloque', categoria: 'empresas', descripcion: 'Para tiendas y grandes colecciones: alta masiva y seguimiento por lote.', plazoDias: 14, prioridad: 0, extras: ['Seguimiento por lote'], valorMax: null, precio: null, destacado: false, orden: 6 },
];

export const DEMO_USUARIOS = [
  { nombre: 'Administración IGS', email: 'admin@igs.demo', rol: 'admin' },
  { nombre: 'Equipo de gradeo', email: 'trabajador@igs.demo', rol: 'trabajador' },
  { nombre: 'Cliente de prueba', email: 'cliente@igs.demo', rol: 'cliente' },
  { nombre: 'Tienda de prueba', email: 'tienda@igs.demo', rol: 'cliente' },
];

/** llegada / creado / publicado: hace cuántos días ocurrió (null = todavía no). */
export const DEMO_PEDIDOS = [
  { codigo: 'PED-0001', cliente: 'cliente@igs.demo', servicio: 'STD', unidades: 12, estado: 'en_gradeo', creado: 10, llegada: 6, publicado: null },
  { codigo: 'PED-0002', cliente: 'cliente@igs.demo', servicio: 'EXP', unidades: 3, estado: 'recibido', creado: 5, llegada: 4, publicado: null },
  { codigo: 'PED-0003', cliente: 'tienda@igs.demo', servicio: 'BLQ', unidades: 150, estado: 'recibido', creado: 9, llegada: 2, publicado: null },
  { codigo: 'PED-0004', cliente: 'cliente@igs.demo', servicio: 'PRE', unidades: 1, estado: 'pendiente_envio', creado: 1, llegada: null, publicado: null },
  { codigo: 'PED-0005', cliente: 'tienda@igs.demo', servicio: 'STD', unidades: 6, estado: 'pendiente_envio', creado: 1, llegada: null, publicado: null },
  { codigo: 'PED-0006', cliente: 'cliente@igs.demo', servicio: 'STD', unidades: 3, estado: 'completado', creado: 45, llegada: 40, publicado: 32 },
];

/** Campos comunes de un pedido de demo (los usan el script de carga y el modo demo). */
export const construirPedidoDemo = (p, servicio) => ({
  codigo: p.codigo,
  servicio: copiaServicio(servicio),
  unidades: p.unidades,
  estado: p.estado,
  notas: '',
  creadoEn: haceDias(p.creado),
  fechaLlegada: haceDias(p.llegada),
  fechaLimite: calcularFechaLimite(haceDias(p.creado), servicio.plazoDias),
  fechaPublicacion: haceDias(p.publicado),
});

export const DEMO_PRODUCTOS = [
  {
    idCertificado: 'IGS-2026-000001', pedido: 'PED-0006', nombre: 'Marshadow & Machamp GX', nota: 10,
    subnotas: { centrado: 10, esquinas: 10, bordes: 10, superficie: 10 },
    marca: 'Pokémon', anio: 2019, expansion: 'Double Blaze', clase: 'Tag Team GX', numeroTarjeta: '101/095',
    categoria: 'tcg', variedad: 'Secret Rare (SR)', idioma: 'Japonés', gradeado: 32,
    comentario: 'Centrado perfecto, esquinas y bordes sin desgaste y superficie sin marcas. Gradeo PRISTINE.',
  },
  {
    idCertificado: 'IGS-2026-000002', pedido: 'PED-0006', nombre: 'Delantero centro', nota: 8,
    subnotas: { centrado: 8, esquinas: 7.5, bordes: 8, superficie: 8.5 },
    marca: 'Marca de ejemplo', anio: 2021, expansion: 'Liga 2021-22', clase: 'Base', numeroTarjeta: '23/200', categoria: 'deportivas',
    variedad: 'Rookie', idioma: 'Inglés', gradeado: 32,
    comentario: 'Esquinas con desgaste visible y bordes con pequeñas marcas de manipulación.',
  },
  {
    idCertificado: 'IGS-2026-000003', pedido: 'PED-0006', nombre: 'Charizard', nota: 9.5,
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
