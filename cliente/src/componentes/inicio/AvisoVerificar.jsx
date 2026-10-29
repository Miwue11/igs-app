import { RUTAS } from '../../constantes/rutas.js';
import { Boton } from '../ui/Boton.jsx';

export function AvisoVerificar() {
  return (
    <section className="seccion-ajustada">
      <div className="contenedor">
        <div className="llamada">
          <div>
            <h2>¿Vas a comprar un producto gradeado?</h2>
            <p>
              Introduce el ID de la etiqueta y comprueba que la foto, el grado y los datos coinciden con lo que te
              ofrecen. La consulta es pública y no necesita cuenta.
            </p>
          </div>
          <Boton href={RUTAS.CONSULTA} variante="oscuro" grande>Verificar un ID</Boton>
        </div>
      </div>
    </section>
  );
}
