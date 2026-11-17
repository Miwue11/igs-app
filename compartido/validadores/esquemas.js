import { LIMITES } from '../constantes/formatos.js';
import { MENSAJES } from '../constantes/mensajes.js';
import { IDS_CATEGORIA, IDS_TIPO_TICKET } from '../constantes/catalogo.js';
import { ROLES } from '../constantes/roles.js';
import { ESTADOS_PEDIDO, ESTADOS_TICKET } from '../constantes/estados.js';
import { MOTIVOS_NO_GRADEABLE } from '../constantes/negocio.js';
import {
  requerido, email, minimo, maximo, igualA, aceptado, enLista, entero, nota, anio, idCertificado, articulosDeclarados, codigoUV, validar,
} from './reglas.js';

/** Esquemas de validación: los usan el formulario (cliente) y la API (servidor). */
export const ESQUEMAS = Object.freeze({
  registro: {
    nombre: [requerido, maximo(LIMITES.NOMBRE_MAX)],
    email: [requerido, email],
    contrasena: [requerido, minimo(LIMITES.CONTRASENA_MIN, MENSAJES.CONTRASENA_CORTA)],
    contrasena2: [requerido, igualA('contrasena', MENSAJES.CONTRASENA_DISTINTA)],
    condiciones: [aceptado],
  },
  entrar: {
    email: [requerido, email],
    contrasena: [requerido],
  },
  ticket: {
    nombre: [requerido, maximo(LIMITES.NOMBRE_MAX)],
    email: [requerido, email],
    tipo: [requerido, enLista(IDS_TIPO_TICKET)],
    mensaje: [requerido, maximo(LIMITES.MENSAJE_MAX)],
  },
  pedido: {
    servicio: [requerido],
    articulos: [articulosDeclarados],
    notas: [maximo(LIMITES.MENSAJE_MAX)],
  },
  producto: {
    pedido: [requerido],
    articulo: [requerido, entero(0, LIMITES.UNIDADES_MAX, MENSAJES.OPCION)],
    nombre: [requerido, maximo(120)],
    marca: [requerido],
    anio: [anio],
    expansion: [maximo(LIMITES.EXPANSION_MAX)],
    categoria: [requerido, enLista(IDS_CATEGORIA)],
    'subnotas.centrado': [requerido, nota],
    'subnotas.esquinas': [requerido, nota],
    'subnotas.bordes': [requerido, nota],
    'subnotas.superficie': [requerido, nota],
    comentario: [maximo(LIMITES.MENSAJE_MAX)],
  },
  consulta: {
    id: [requerido, idCertificado],
  },
  verificarUV: {
    codigo: [requerido, codigoUV],
  },
  noGradeable: {
    motivo: [requerido, enLista(MOTIVOS_NO_GRADEABLE)],
  },
  estadoPedido: {
    estado: [requerido, enLista(Object.values(ESTADOS_PEDIDO))],
  },
  estadoTicket: {
    estado: [requerido, enLista(Object.values(ESTADOS_TICKET))],
  },
  rol: {
    rol: [requerido, enLista(Object.values(ROLES))],
  },
});

export const validarCon = (nombre, datos) => validar(ESQUEMAS[nombre], datos);
