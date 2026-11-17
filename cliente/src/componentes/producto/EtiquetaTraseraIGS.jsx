import { crearQR, qrComoRutaSVG, etiquetaGrado as nombreGrado, nivelGrado } from '@compartido';
import { conBase } from '../../enrutador/base.js';
import { rutaConsulta } from '../../constantes/rutas.js';
import { clases } from '../../utilidades/clases.js';

const MARGEN_QR = 2;

/** Dirección pública de la ficha del certificado (lo que abre el QR). */
export const urlCertificado = (idCertificado, origen = window.location.origin) =>
  `${origen}${conBase(rutaConsulta(idCertificado))}`;

/** Código de barras decorativo a partir de los dígitos del certificado (cada dígito da un grosor). */
function CodigoBarras({ texto }) {
  const digitos = texto.replace(/\D/g, '').split('').map(Number);
  let x = 0;
  const barras = [...digitos, ...digitos.reverse()].map((d, i) => {
    const ancho = 1 + (d % 3);
    const barra = <rect key={i} x={x} y="0" width={ancho} height="10" />;
    x += ancho + 1 + ((d + i) % 2);
    return barra;
  });
  return <svg className="trasera-barras" viewBox={`0 0 ${x} 10`} preserveAspectRatio="none" aria-hidden="true">{barras}</svg>;
}

/**
 * Parte trasera de la etiqueta del slab: marca IGS, sello central y un QR que abre la ficha pública
 * del certificado para verificarlo. Mismos colores que la frontal (granate en PRISTINE, azul en el resto).
 * Lleva además el código UV, impreso con tinta invisible: solo se ve con luz ultravioleta (`uv`).
 * Si no se conoce el código (ficha pública) se muestra su posición sin revelarlo.
 */
export function EtiquetaTraseraIGS({ producto, origen, codigoUV = null, uv = false, className }) {
  const { idCertificado, nota, subnotas } = producto;
  const grado = producto.etiquetaGrado || (nota != null ? nombreGrado(nota, subnotas) : '');
  const nivel = nota != null ? nivelGrado(nota, grado) : 'vacio';
  const url = idCertificado ? urlCertificado(idCertificado, origen) : null;
  const qr = url ? crearQR(url) : null;
  const lado = qr ? qr.tamano + MARGEN_QR * 2 : 0;

  return (
    <div className={clases('etiqueta-igs etiqueta-trasera', `etiqueta-${nivel}`, uv && 'modo-uv', className)} role="img"
      aria-label={`Parte trasera de la etiqueta IGS${idCertificado ? `, certificado ${idCertificado}, con código QR de verificación` : ''}`}>
      <div className="trasera-cuerpo" aria-hidden="true">
        <div className="trasera-marca">
          <strong>IGS</strong>
          <small>Iberian Grading Services</small>
          <small>Escanea para verificar</small>
        </div>
        <div className="trasera-sello"><span>IGS</span></div>
        <div className="trasera-qr">
          {qr ? (
            <svg viewBox={`${-MARGEN_QR} ${-MARGEN_QR} ${lado} ${lado}`} shapeRendering="crispEdges">
              <rect x={-MARGEN_QR} y={-MARGEN_QR} width={lado} height={lado} fill="#fff" />
              <path d={qrComoRutaSVG(qr)} fill="#111" />
            </svg>
          ) : <span>QR</span>}
        </div>
      </div>
      <div className="trasera-uv" aria-hidden="true">
        <span>{codigoUV ?? '····-····'}</span>
        <small>IGS · UV</small>
      </div>
      <div className="trasera-pie" aria-hidden="true">
        <CodigoBarras texto={idCertificado || '0000000000'} />
        <span>{idCertificado || 'Se asigna al guardar'}</span>
      </div>
    </div>
  );
}
