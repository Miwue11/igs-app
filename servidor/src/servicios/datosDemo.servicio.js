/**
 * Datos de demostración (los mismos que usa el modo demo de la web).
 * Los usa el script «npm run datos» y el arranque en Render cuando la base de datos está vacía.
 */
import { cifrarContrasena } from './acceso.servicio.js';
import { Usuario, Servicio, Pedido, Producto, Ticket, Contador, Foto } from '../modelos/index.js';
import { etiquetaGrado, contadorCertificado } from '../../../compartido/index.js';
import {
  CONTRASENA_DEMO, DEMO_SERVICIOS, DEMO_USUARIOS, DEMO_PEDIDOS, DEMO_PRODUCTOS, DEMO_TICKETS, haceDias, construirPedidoDemo, historialDemo,
} from '../../../compartido/demo/datos.js';

/** Borra la base de datos (también las colecciones antiguas) y recrea los índices. */
/** Borra solo los datos de la demo: el catálogo de cartas sincronizado de CardTrader se conserva. */
const MODELOS_DEMO = [Usuario, Servicio, Pedido, Producto, Ticket, Contador, Foto];
const vaciar = async () => {
  await Promise.all(MODELOS_DEMO.map((m) => m.deleteMany({})));
  await Promise.all(MODELOS_DEMO.map((m) => m.syncIndexes()));
};

const crearUsuarios = async () => {
  const hashContrasena = await cifrarContrasena(CONTRASENA_DEMO);
  const usuarios = await Usuario.insertMany(DEMO_USUARIOS.map((u) => ({ ...u, hashContrasena })));
  return new Map(usuarios.map((u) => [u.email, u]));
};

const crearPedidos = (usuarios, servicios) =>
  Pedido.insertMany(DEMO_PEDIDOS.map((p) => {
    const servicio = servicios.get(p.servicio);
    const cliente = usuarios.get(p.cliente);
    return {
      ...construirPedidoDemo(p, servicio),
      cliente: cliente._id,
      historial: historialDemo(p).map((h, i) => (i === 0 ? { ...h, usuario: cliente._id } : h)),
    };
  }));

const crearProductos = (pedidos, gradeador) =>
  Producto.insertMany(DEMO_PRODUCTOS.map(({ gradeado, pedido, ...p }) => ({
    ...p,
    pedido: pedidos.get(pedido)._id,
    pedidoCodigo: pedido,
    etiquetaGrado: etiquetaGrado(p.nota, p.subnotas),
    gradeadoPor: gradeador._id,
    fechaGradeo: haceDias(gradeado),
  })));

const crearTickets = (usuarios) =>
  Ticket.insertMany(DEMO_TICKETS.map(({ cliente, creado, ...t }) => {
    const usuario = usuarios.get(cliente);
    return { ...t, usuario: usuario._id, nombre: usuario.nombre, email: usuario.email, creadoEn: haceDias(creado) };
  }));

/** Deja los contadores en el último número usado para que los nuevos códigos sigan la serie. */
const ajustarContadores = () => {
  const ultimo = (codigo) => Number(codigo.split('-').pop());
  const idsCertificado = DEMO_PRODUCTOS.map((p) => p.idCertificado);
  const anio = idsCertificado[0].split('-')[1];
  return Contador.insertMany([
    { _id: 'pedido', secuencia: Math.max(...DEMO_PEDIDOS.map((p) => ultimo(p.codigo))) },
    { _id: 'ticket', secuencia: Math.max(...DEMO_TICKETS.map((t) => ultimo(t.codigo))) },
    { _id: contadorCertificado(anio), secuencia: Math.max(...idsCertificado.map(ultimo)) },
  ]);
};

/**
 * Versión del formato de los datos de demo. Súbela cuando cambie su estructura:
 * al arrancar con SEMBRAR_DEMO_SI_VACIA, una base de datos de demo con una versión anterior se recarga.
 *   2 → pedidos con artículos declarados, importe y plazo desde la llegada.
 *   3 → catálogo sin el Lote Pro (Estándar, Express, Premium, Cómics y Segunda Opinión).
 *   4 → historial de estados completo en los pedidos de ejemplo.
 */
export const VERSION_DATOS_DEMO = 4;
const CONTADOR_VERSION = 'version-datos-demo';

/** Borra la base de datos y carga los datos de demo. Necesita la conexión ya abierta. */
export const cargarDatosDemo = async () => {
  await vaciar();
  const usuarios = await crearUsuarios();
  const servicios = new Map((await Servicio.insertMany(DEMO_SERVICIOS)).map((s) => [s.codigo, s]));
  const pedidos = new Map((await crearPedidos(usuarios, servicios)).map((p) => [p.codigo, p]));
  await crearProductos(pedidos, usuarios.get('trabajador@igs.demo'));
  await crearTickets(usuarios);
  await ajustarContadores();
  await Contador.create({ _id: CONTADOR_VERSION, secuencia: VERSION_DATOS_DEMO });
  return CONTRASENA_DEMO;
};

/** El certificado de ejemplo lleva las fotos del slab de muestra, frontal y trasera (si no tiene o son las antiguas). */
const ponerFotoEjemplo = () => {
  const ejemplo = DEMO_PRODUCTOS[0];
  return Producto.updateOne(
    {
      idCertificado: ejemplo.idCertificado,
      nombre: ejemplo.nombre,
      'imagenes.anverso': { $in: [null, '/ejemplos/marshadow-machamp-gx.jpg', '/ejemplos/slab-marshadow-machamp-gx.webp'] },
    },
    { $set: { 'imagenes.anverso': ejemplo.imagenes.anverso, 'imagenes.reverso': ejemplo.imagenes.reverso } },
  );
};

/**
 * Mantiene al día el catálogo de una base de datos de demo (nombres, descripciones y categorías)
 * sin borrar pedidos ni certificados. Los pedidos guardan una copia del nombre del servicio: también se actualiza.
 */
const sincronizarServiciosDemo = async () => {
  await Promise.all(DEMO_SERVICIOS.map(async (s) => {
    await Servicio.updateOne({ codigo: s.codigo }, { $set: s });
    await Pedido.updateMany({ 'servicio.codigo': s.codigo }, { $set: { 'servicio.nombre': s.nombre } });
  }));
};

/**
 * Carga la demo si la base de datos está vacía (primer arranque) o si es una demo con un formato antiguo.
 * Una base de datos con datos reales (sin marca de versión de demo y con usuarios) no se toca.
 */
export const cargarDatosDemoSiVacia = async () => {
  const vacia = (await Usuario.estimatedDocumentCount()) === 0;
  const version = (await Contador.findById(CONTADOR_VERSION).lean())?.secuencia ?? 0;
  const demoAntigua = !vacia && version < VERSION_DATOS_DEMO && (await Usuario.exists({ email: 'admin@igs.demo' }));
  if (!vacia && !demoAntigua) {
    if (version >= VERSION_DATOS_DEMO) await sincronizarServiciosDemo();
    await ponerFotoEjemplo();
    return false;
  }

  const contrasena = await cargarDatosDemo();
  const motivo = vacia ? 'Base de datos vacía' : `Datos de demo antiguos (versión ${version})`;
  console.log(`[igs] ${motivo}: cargados los datos de demo v${VERSION_DATOS_DEMO}. Contraseña de las cuentas: ${contrasena}`);
  return true;
};
