import { HTTP } from '../constantes/http.js';
import { consultarProducto, crearProducto, productosDePedido } from '../servicios/productos.servicio.js';
import { codigoUV, codigoUVCorrecto } from '../servicios/codigoUV.servicio.js';

export const consultar = async (req, res) => res.json(await consultarProducto(req.params.idCertificado));

/** Al publicar, el gradeador recibe el código UV para imprimirlo en la etiqueta trasera. Nunca sale en la ficha pública. */
export const crear = async (req, res) => {
  const producto = await crearProducto(req.body, req.files, req.usuario._id);
  res.status(HTTP.CREADO).json({ ...producto.toJSON(), codigoUV: codigoUV(producto.idCertificado) });
};

export const dePedido = async (req, res) => res.json(await productosDePedido(req.params.codigo));

/** Solo personal de IGS: para reimprimir una etiqueta. */
export const verCodigoUV = async (req, res) => {
  const producto = await consultarProducto(req.params.idCertificado);
  res.json({ idCertificado: producto.idCertificado, codigoUV: codigoUV(producto.idCertificado) });
};

/** Público: el comprador escribe el código que ve con la lámpara UV y se le dice si coincide. */
export const verificarUV = async (req, res) => {
  const producto = await consultarProducto(req.params.idCertificado);
  res.json({ idCertificado: producto.idCertificado, valido: codigoUVCorrecto(producto.idCertificado, req.body.codigo) });
};
