import { Producto } from '../modelos/index.js';
import { guardarFoto } from './fotos.servicio.js';
import {
  MENSAJES, ESTADOS_ARTICULO, calcularNotaFinal, contadorCertificado, esIdCertificado, etiquetaGrado,
  formatearIdCertificado, normalizarIdCertificado,
} from '../../../compartido/index.js';
import { CAMPOS_FOTO } from '../constantes/http.js';
import { siguienteNumero } from './contador.servicio.js';
import { resolverArticulo, liberarArticulo } from './pedidos.servicio.js';
import { noEncontrado, peticionIncorrecta } from '../utilidades/errorHttp.js';
import { elegir } from '../utilidades/elegir.js';

/** Campos que un trabajador puede enviar desde el formulario (evita asignaciones masivas). La nota no: se calcula. */
const CAMPOS_EDITABLES = [
  'nombre', 'subnotas', 'marca', 'anio', 'expansion', 'clase', 'numeroTarjeta',
  'categoria', 'variedad', 'idioma', 'comentario',
];

/** Lo que no debe verse en la ficha pública. */
const OCULTO_EN_PUBLICO = '-gradeadoPor -pedido';

const rutasDeFotos = async (archivos = {}) =>
  Object.fromEntries(
    await Promise.all(CAMPOS_FOTO.map(async (campo) => {
      const archivo = archivos[campo]?.[0];
      return [campo, archivo ? await guardarFoto(archivo) : null];
    })),
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

/**
 * Gradea un artículo declarado del pedido y publica su certificado.
 * La nota final se calcula con las subnotas (no la elige el gradeador).
 */
export const crearProducto = async (datos, archivos, usuarioId) => {
  const campos = elegir(datos, CAMPOS_EDITABLES);
  const nota = calcularNotaFinal(campos.subnotas);
  if (nota == null) throw peticionIncorrecta(MENSAJES.SUBNOTAS);

  const indice = Number(datos.articulo);
  const idCertificado = await nuevoIdCertificado();
  const pedido = await resolverArticulo(datos.pedido, indice, { estado: ESTADOS_ARTICULO.GRADEADO, idCertificado });

  try {
    return await Producto.create({
      ...campos,
      nota,
      idCertificado,
      pedido: pedido._id,
      pedidoCodigo: pedido.codigo,
      articulo: indice,
      etiquetaGrado: etiquetaGrado(nota, campos.subnotas),
      imagenes: await rutasDeFotos(archivos),
      gradeadoPor: usuarioId,
    });
  } catch (error) {
    await liberarArticulo(pedido.codigo, indice);
    throw error;
  }
};

export const productosDePedido = (codigo) =>
  Producto.find({ pedidoCodigo: codigo }).select(OCULTO_EN_PUBLICO).sort({ creadoEn: 1 });
