import {
  ROLES, ROLES_INTERNOS, ESTADOS_PEDIDO, ESTADOS_EN_COLA, MENSAJES,
  validarCon, sinErrores, esIdCertificado, normalizarIdCertificado, ordenarCola,
  etiquetaGrado, formatearIdCertificado, formatearPedido, formatearTicket,
  ESTADOS_ARTICULO, calcularNotaFinal, prepararArticulos, errorArticulosServicio, pedidoNuevo,
  errorCambioEstado, aplicarCambioEstado, errorResolverArticulo,
} from '@compartido';
import { DEMO_PRODUCTOS } from '@compartido/demo/datos.js';
import { CONFIGURACION } from '../../constantes/configuracion.js';
import { ErrorApi } from '../http.js';
import { crearBaseDemo } from './baseDemo.js';
import { leerSesion, guardarSesion } from './sesionDemo.js';

/**
 * Implementación de demostración: misma interfaz que la API real, pero con datos en memoria.
 * Sirve para enseñar la web sin servidor ni base de datos (npm run demo).
 */
const db = crearBaseDemo();
let ultimoId = 1000;
const nuevoId = () => `d${(ultimoId += 1)}`;
const ahora = () => new Date().toISOString();

const pausa = () => new Promise((listo) => setTimeout(listo, CONFIGURACION.RETARDO_DEMO_MS));
const responder = (funcion) => async (...args) => {
  await pausa();
  return structuredClone(funcion(...args));
};

const publico = ({ contrasena, ...usuario }) => usuario;
const usuarioActual = () => db.usuarios.find((u) => u.id === leerSesion()) ?? null;

const exigir = (roles) => {
  const usuario = usuarioActual();
  if (!usuario) throw new ErrorApi(401, 'Inicia sesión para continuar.');
  if (roles && !roles.includes(usuario.rol)) throw new ErrorApi(403, 'No tienes permiso para esta acción.');
  return usuario;
};

const comprobar = (esquema, datos) => {
  const errores = validarCon(esquema, datos);
  if (!sinErrores(errores)) throw new ErrorApi(400, 'Revisa los datos del formulario.', errores);
};

const buscarPedido = (codigo) => {
  const pedido = db.pedidos.find((p) => p.codigo === codigo);
  if (!pedido) throw new ErrorApi(404, 'No existe ese pedido.');
  return pedido;
};

const conCliente = (pedido) => {
  const { id, nombre, email } = db.usuarios.find((u) => u.id === pedido.cliente);
  return { ...pedido, cliente: { id, nombre, email } };
};

const urlFoto = (archivo) => (archivo ? URL.createObjectURL(archivo) : null);

const acceso = {
  yo: responder(() => publico(exigir())),
  entrar: responder((datos) => {
    comprobar('entrar', datos);
    const usuario = db.usuarios.find((u) => u.email === datos.email.trim().toLowerCase());
    if (!usuario || usuario.contrasena !== datos.contrasena) throw new ErrorApi(401, 'Email o contraseña incorrectos.');
    guardarSesion(usuario.id);
    return publico(usuario);
  }),
  registro: responder((datos) => {
    comprobar('registro', datos);
    const email = datos.email.trim().toLowerCase();
    if (db.usuarios.some((u) => u.email === email)) throw new ErrorApi(409, 'Ya existe una cuenta con ese email.');
    const usuario = { id: nuevoId(), nombre: datos.nombre.trim(), email, contrasena: datos.contrasena, rol: ROLES.CLIENTE, activo: true, creadoEn: ahora() };
    db.usuarios.push(usuario);
    guardarSesion(usuario.id);
    return publico(usuario);
  }),
  salir: responder(() => guardarSesion(null)),
};

const servicios = {
  listar: responder(() => db.servicios.filter((s) => s.activo).sort((a, b) => a.orden - b.orden)),
};

const productos = {
  consultar: responder((texto) => {
    const idCertificado = normalizarIdCertificado(texto);
    if (!esIdCertificado(idCertificado)) throw new ErrorApi(400, MENSAJES.ID_CERTIFICADO);
    const producto = db.productos.find((p) => p.idCertificado === idCertificado);
    if (!producto) throw new ErrorApi(404, 'No existe ningún producto con ese ID.');
    return producto;
  }),
  crear: async (datos, fotos = {}) => {
    const imagenes = { anverso: urlFoto(fotos.anverso), reverso: urlFoto(fotos.reverso), etiqueta: urlFoto(fotos.etiqueta) };
    return responder(() => {
      exigir(ROLES_INTERNOS);
      comprobar('producto', datos);
      const nota = calcularNotaFinal(datos.subnotas);
      if (nota == null) throw new ErrorApi(400, MENSAJES.SUBNOTAS);
      const pedido = buscarPedido(datos.pedido);
      const indice = Number(datos.articulo);
      const error = errorResolverArticulo(pedido, indice);
      if (error) throw new ErrorApi(409, error);
      db.contadores.cert += 1;
      const idCertificado = formatearIdCertificado(new Date().getFullYear(), db.contadores.cert);
      const { pedido: _p, articulo: _a, ...campos } = datos;
      const producto = {
        ...campos, nota, id: nuevoId(), idCertificado, pedidoCodigo: pedido.codigo, articulo: indice,
        imagenReferencia: pedido.articulos[indice]?.imagen ?? null,
        etiquetaGrado: etiquetaGrado(nota, datos.subnotas), imagenes, fechaGradeo: ahora(),
      };
      Object.assign(pedido.articulos[indice], { estado: ESTADOS_ARTICULO.GRADEADO, idCertificado });
      db.productos.push(producto);
      return producto;
    })();
  },
};

const pedidos = {
  crear: responder((datos) => {
    const usuario = exigir([ROLES.CLIENTE]);
    comprobar('pedido', datos);
    const servicio = db.servicios.find((s) => s.codigo === datos.servicio);
    if (!servicio) throw new ErrorApi(400, 'El servicio elegido no existe.');
    const articulos = prepararArticulos(datos.articulos);
    const error = errorArticulosServicio(servicio, articulos);
    if (error) throw new ErrorApi(400, error, { articulos: error });
    db.contadores.pedido += 1;
    const pedido = {
      ...pedidoNuevo(servicio, articulos, ahora()),
      id: nuevoId(), codigo: formatearPedido(db.contadores.pedido), cliente: usuario.id,
      estado: ESTADOS_PEDIDO.PENDIENTE_ENVIO, notas: datos.notas ?? '',
    };
    db.pedidos.push(pedido);
    return pedido;
  }),
  mios: responder(() => {
    const usuario = exigir([ROLES.CLIENTE]);
    return db.pedidos.filter((p) => p.cliente === usuario.id).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }),
  cola: responder((estado) => {
    exigir(ROLES_INTERNOS);
    const estados = estado ? [estado] : ESTADOS_EN_COLA;
    return ordenarCola(db.pedidos.filter((p) => estados.includes(p.estado))).map(conCliente);
  }),
  cambiarEstado: responder((codigo, estado) => {
    exigir(ROLES_INTERNOS);
    comprobar('estadoPedido', { estado });
    const pedido = buscarPedido(codigo);
    const error = errorCambioEstado(pedido, estado);
    if (error) throw new ErrorApi(409, error);
    aplicarCambioEstado(pedido, estado, ahora());
    return conCliente(pedido);
  }),
  noGradeable: responder((codigo, indice, motivo) => {
    exigir(ROLES_INTERNOS);
    comprobar('noGradeable', { motivo });
    const pedido = buscarPedido(codigo);
    const error = errorResolverArticulo(pedido, indice);
    if (error) throw new ErrorApi(409, error);
    Object.assign(pedido.articulos[indice], { estado: ESTADOS_ARTICULO.NO_GRADEABLE, motivo });
    return conCliente(pedido);
  }),
  productos: responder((codigo) => {
    exigir(ROLES_INTERNOS);
    return db.productos.filter((p) => p.pedidoCodigo === codigo);
  }),
};

const tickets = {
  crear: responder((datos) => {
    comprobar('ticket', datos);
    db.contadores.ticket += 1;
    const ticket = {
      id: nuevoId(), codigo: formatearTicket(db.contadores.ticket), usuario: usuarioActual()?.id ?? null,
      nombre: datos.nombre, email: datos.email, tipo: datos.tipo, referencia: datos.referencia ?? '',
      mensaje: datos.mensaje, estado: 'abierto', creadoEn: ahora(),
    };
    db.tickets.push(ticket);
    return ticket;
  }),
  listar: responder((estado) => {
    exigir(ROLES_INTERNOS);
    return db.tickets.filter((t) => !estado || t.estado === estado).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }),
  cambiarEstado: responder((codigo, estado) => {
    exigir(ROLES_INTERNOS);
    comprobar('estadoTicket', { estado });
    const ticket = db.tickets.find((t) => t.codigo === codigo);
    if (!ticket) throw new ErrorApi(404, 'No existe ese ticket.');
    ticket.estado = estado;
    return ticket;
  }),
};

const usuarios = {
  listar: responder(() => {
    exigir([ROLES.ADMIN]);
    return db.usuarios.map(publico).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }),
  cambiarRol: responder((id, rol) => {
    const admin = exigir([ROLES.ADMIN]);
    comprobar('rol', { rol });
    if (id === admin.id) throw new ErrorApi(403, 'No puedes cambiar tu propio rol.');
    const usuario = db.usuarios.find((u) => u.id === id);
    if (!usuario) throw new ErrorApi(404, 'No existe ese usuario.');
    usuario.rol = rol;
    return publico(usuario);
  }),
};

/** En el modo demo la lectura de la etiqueta devuelve siempre los datos de un ejemplo. */
const ia = {
  leerEtiqueta: responder((foto) => {
    exigir(ROLES_INTERNOS);
    if (!foto) throw new ErrorApi(400, 'Sube primero la foto de la etiqueta.');
    const { nombre, marca, anio, expansion, clase, numeroTarjeta, categoria, variedad, idioma } = DEMO_PRODUCTOS[0];
    return { nombre, marca, anio, expansion, clase, numeroTarjeta, categoria, variedad, idioma };
  }),
};

export const apiDemo = { acceso, servicios, productos, pedidos, tickets, usuarios, ia };
