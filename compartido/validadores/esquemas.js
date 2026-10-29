import { LIMITES } from '../constantes/formatos.js';
import { MENSAJES } from '../constantes/mensajes.js';
import { IDS_CATEGORIA, IDS_TIPO_TICKET } from '../constantes/catalogo.js';
import { ROLES } from '../constantes/roles.js';
import { ESTADOS_PEDIDO, ESTADOS_TICKET } from '../constantes/estados.js';
import {
  requerido, email, minimo, maximo, igualA, aceptado, enLista, entero, nota, idCertificado, validar,
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
    unidades: [requerido, entero(LIMITES.UNIDADES_MIN, LIMITES.UNIDADES_MAX, MENSAJES.UNIDADES)],
    notas: [maximo(LIMITES.MENSAJE_MAX)],
  },
  producto: {
    pedido: [requerido],
    nombre: [requerido, maximo(120)],
    nota: [requerido, nota],
    marca: [requerido],
    categoria: [requerido, enLista(IDS_CATEGORIA)],
    'subnotas.centrado': [nota],
    'subnotas.esquinas': [nota],
    'subnotas.bordes': [nota],
    'subnotas.superficie': [nota],
    comentario: [maximo(LIMITES.MENSAJE_MAX)],
  },
  consulta: {
    id: [requerido, idCertificado],
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
