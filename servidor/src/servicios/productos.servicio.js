import { Producto } from '../modelos/index.js';
import {
  MENSAJES, contadorCertificado, esIdCertificado, etiquetaGrado, formatearIdCertificado, normalizarIdCertificado,
} from '../../../compartido/index.js';
import { CAMPOS_FOTO } from '../constantes/http.js';
import { siguienteNumero } from './contador.servicio.js';
import { buscarPedido } from './pedidos.servicio.js';
import { noEncontrado, peticionIncorrecta } from '../utilidades/errorHttp.js';
import { elegir } from '../utilidades/elegir.js';

/** Campos que un trabajador puede enviar desde el formulario (evita asignaciones masivas). */
const CAMPOS_EDITABLES = [
  'nombre', 'nota', 'subnotas', 'marca', 'clase', 'numeroTarjeta',
  'categoria', 'variedad', 'idioma', 'comentario',
];

/** Lo que no debe verse en la ficha pública. */
const OCULTO_EN_PUBLICO = '-gradeadoPor -pedido';

const rutasDeFotos = (archivos = {}) =>
  Object.fromEntries(
    CAMPOS_FOTO.map((campo) => {
      const archivo = archivos[campo]?.[0];
      return [campo, archivo ? `/fotos/${archivo.filename}` : null];
    }),
  );

const nuevoIdCertificado = async () => {
  const anio = new Date().getFullYear();
  return formatearIdCertificado(anio, await siguienteNumero(contadorCertificado(anio)));
};

export const consultarProducto = async (texto) => {
  const idCertificado = normalizarIdCertificado(texto);
  if (!esIdCertificado(idCertificado)) throw peticionIncorrecta(MENSAJES.ID_CERTIFICADO);

  const producto = await Producto.findOne({ idCertificado }).select(OCULTO_EN_PUBLICO);
  if (!producto) throw noEncontrado('No existe ningún producto con ese ID.');
  return producto;
};

export const crearProducto = async (datos, archivos, usuarioId) => {
  const pedido = await buscarPedido(datos.pedido);
  const campos = elegir(datos, CAMPOS_EDITABLES);

  return Producto.create({
    ...campos,
    idCertificado: await nuevoIdCertificado(),
    pedido: pedido._id,
    pedidoCodigo: pedido.codigo,
    etiquetaGrado: etiquetaGrado(campos.nota),
    imagenes: rutasDeFotos(archivos),
    gradeadoPor: usuarioId,
  });
};

export const productosDePedido = (codigo) =>
  Producto.find({ pedidoCodigo: codigo }).select(OCULTO_EN_PUBLICO).sort({ creadoEn: 1 });
