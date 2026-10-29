import { BuscadorCertificado } from '../producto/BuscadorCertificado.jsx';
import { Losa } from './Losa.jsx';

/** Bloque principal de la página de inicio. */
export function Portada({ alBuscar }) {
  return (
    <section className="portada">
      <div className="contenedor">
        <div className="portada-contenido">
          <span className="antetitulo">GRADEO PROFESIONAL DE COLECCIONABLES</span>
          <h1>Certificamos el estado real de tus coleccionables</h1>
          <p className="portada-texto">
            Envíanos tus cartas y productos, los evaluamos, los encapsulamos y publicamos su ficha.
            Cualquiera puede verificarla con su ID para comprar y vender con seguridad.
          </p>
          <BuscadorCertificado variante="portada" alBuscar={alBuscar} />
        </div>
        <Losa />
      </div>
    </section>
  );
}
