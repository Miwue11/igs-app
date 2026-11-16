/**
 * Datos de demostración (los mismos que usa el modo demo de la web).
 * Los usa el script «npm run datos» y el arranque en Render cuando la base de datos está vacía.
 */
import mongoose from 'mongoose';
import { cifrarContrasena } from './acceso.servicio.js';
import { Usuario, Servicio, Pedido, Producto, Ticket, Contador, Foto } from '../modelos/index.js';
import { etiquetaGrado, contadorCertificado, ESTADOS_PEDIDO } from '../../../compartido/index.js';
import {
  CONTRASENA_DEMO, DEMO_SERVICIOS, DEMO_USUARIOS, DEMO_PEDIDOS, DEMO_PRODUCTOS, DEMO_TICKETS, haceDias, construirPedidoDemo,
} from '../../../compartido/demo/datos.js';

/** Borra la base de datos (también las colecciones antiguas) y recrea los índices. */
const vaciar = async () => {
  await mongoose.connection.dropDatabase();
  await Promise.all([Usuario, Servicio, Pedido, Producto, Ticket, Contador, Foto].map((m) => m.syncIndexes()));
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
      historial: [{ estado: ESTADOS_PEDIDO.PENDIENTE_ENVIO, usuario: cliente._id, fecha: haceDias(p.creado) }],
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

/** Borra la base de datos y carga los datos de demo. Necesita la conexión ya abierta. */
export const cargarDatosDemo = async () => {
  await vaciar();
  const usuarios = await crearUsuarios();
  const servicios = new Map((await Servicio.insertMany(DEMO_SERVICIOS)).map((s) => [s.codigo, s]));
  const pedidos = new Map((await crearPedidos(usuarios, servicios)).map((p) => [p.codigo, p]));
  await crearProductos(pedidos, usuarios.get('trabajador@igs.demo'));
  await crearTickets(usuarios);
  await ajustarContadores();
  return CONTRASENA_DEMO;
};

/** Solo carga la demo si no hay ningún usuario (primer arranque con una base de datos nueva). */
export const cargarDatosDemoSiVacia = async () => {
  if ((await Usuario.estimatedDocumentCount()) > 0) return false;
  const contrasena = await cargarDatosDemo();
  console.log(`[igs] Base de datos vacía: cargados los datos de demo. Contraseña de las cuentas: ${contrasena}`);
  return true;
};
