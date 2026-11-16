import { useEffect, useState } from 'react';
import {
  JUEGOS, buscarCartasOficiales, hayNombreSuficiente, juegoDeMarca, valoresDesdeCarta,
} from '../../servicios/cartasOficiales.js';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';

const ESPERA_MS = 600;

/**
 * Recomienda cartas oficiales según el nombre escrito (o leído de la etiqueta).
 * Al elegir una, se rellenan año, expansión, número, rareza y marca en el formulario.
 */
export function RecomendacionesCartas({ valores, alElegir }) {
  const { nombre = '', marca = '', categoria, idioma } = valores;
  const [juegoElegido, setJuegoElegido] = useState(null);
  const juego = juegoElegido ?? juegoDeMarca(marca);
  const [estado, setEstado] = useState({ cargando: false, cartas: [], error: null });
  const [usada, setUsada] = useState(null);

  const esTcg = categoria === 'tcg';
  const buscable = esTcg && hayNombreSuficiente(nombre);

  useEffect(() => {
    if (!buscable) {
      setEstado({ cargando: false, cartas: [], error: null });
      return undefined;
    }
    const control = new AbortController();
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));
    const temporizador = setTimeout(async () => {
      try {
        const cartas = await buscarCartasOficiales({ nombre, juego, idioma, senal: control.signal });
        setEstado({ cargando: false, cartas, error: null });
      } catch (e) {
        if (e.name === 'AbortError') return;
        setEstado({ cargando: false, cartas: [], error: 'No se ha podido consultar la base de datos de cartas. Rellena los datos a mano.' });
      }
    }, ESPERA_MS);
    return () => {
      clearTimeout(temporizador);
      control.abort();
    };
  }, [buscable, nombre, juego, idioma]);

  const fuente = JUEGOS.find((j) => j.id === juego)?.fuente;

  const elegir = (carta) => {
    alElegir(valoresDesdeCarta(carta));
    setUsada(carta.id);
  };

  return (
    <section className="recomendaciones" aria-labelledby="t-recomendaciones">
      <div className="recomendaciones-cabecera">
        <h2 id="t-recomendaciones">Cartas oficiales recomendadas</h2>
        <label className="recomendaciones-juego">
          <span className="solo-lectores">Juego</span>
          <select className="entrada" value={juego} onChange={(e) => setJuegoElegido(e.target.value)} disabled={!esTcg}>
            {JUEGOS.map((j) => <option key={j.id} value={j.id}>{j.nombre}</option>)}
          </select>
        </label>
      </div>

      {!esTcg && <p className="pequeno">Las recomendaciones con datos oficiales están disponibles para cartas TCG. En deportivas y cómics rellena los datos a mano.</p>}
      {esTcg && !hayNombreSuficiente(nombre) && <p className="pequeno">Escribe el nombre de la carta (o lee la etiqueta) y aquí aparecerán sus versiones oficiales.</p>}
      {buscable && estado.cargando && <p className="pequeno" role="status">Buscando «{nombre.trim()}» en {fuente}…</p>}
      {estado.error && <Mensaje mensaje={{ tipo: 'error', texto: estado.error }} />}
      {buscable && !estado.cargando && !estado.error && estado.cartas.length === 0 && (
        <p className="pequeno" role="status">No hay cartas oficiales con ese nombre en {fuente}. Prueba con el nombre en inglés o cambia de juego.</p>
      )}

      {estado.cartas.length > 0 && !estado.cargando && (
        <ul className="lista-recomendaciones">
          {estado.cartas.map((c) => (
            <li key={c.id} className={c.id === usada ? 'recomendacion elegida' : 'recomendacion'}>
              {c.imagen
                ? <img src={c.imagen} alt="" loading="lazy" width="54" height="75" />
                : <span className="recomendacion-sin-foto" aria-hidden="true">{c.nombre.slice(0, 1)}</span>}
              <div className="recomendacion-datos">
                <strong>{c.nombre}</strong>
                <span>{[c.expansion, c.anio].filter(Boolean).join(' · ')}</span>
                <span className="mono">{[c.numero, c.rareza].filter(Boolean).join(' · ')}</span>
              </div>
              <Boton variante={c.id === usada ? 'oscuro' : 'contorno'} onClick={() => elegir(c)}
                aria-label={`Usar los datos de ${c.nombre}, ${c.expansion} ${c.anio ?? ''}`}>
                {c.id === usada ? 'Usada' : 'Usar'}
              </Boton>
            </li>
          ))}
        </ul>
      )}
      {buscable && fuente && <p className="fuente-datos">Datos oficiales: {fuente} (API gratuita). Revísalos con la carta física antes de guardar.</p>}
    </section>
  );
}
