import { useState } from 'react';
import { Boton } from '../ui/Boton.jsx';
import { EtiquetaTraseraIGS } from './EtiquetaTraseraIGS.jsx';

/** Etiqueta trasera con un botón que simula alumbrarla con una lámpara de luz ultravioleta. */
export function VisorEtiquetaTrasera({ producto, codigoUV = null }) {
  const [uv, setUv] = useState(false);
  return (
    <div className="visor-trasera">
      <EtiquetaTraseraIGS producto={producto} codigoUV={codigoUV} uv={uv} />
      <Boton variante={uv ? 'oscuro' : 'contorno'} onClick={() => setUv((v) => !v)} aria-pressed={uv} className="no-imprimir">
        {uv ? 'Apagar la luz UV' : 'Ver con luz UV'}
      </Boton>
    </div>
  );
}
