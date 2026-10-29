import { DEMO_EJEMPLO_ID } from '@compartido/demo/datos.js';

/** Ilustración de una carta encapsulada con su etiqueta de gradeo (decorativa). */
export function Losa() {
  return (
    <div className="portada-visual" aria-hidden="true">
      <div className="losa">
        <div className="losa-etiqueta">
          <div className="datos">
            <strong>IGS · TCG</strong>
            <span>Holo · 1ª edición</span>
            <span className="mono">{DEMO_EJEMPLO_ID}</span>
          </div>
          <div className="losa-nota"><strong>9,5</strong><span>GEM MINT</span></div>
        </div>
        <div className="hueco">[Imagen del producto]</div>
      </div>
    </div>
  );
}
