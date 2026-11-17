import { useEffect, useState } from 'react';
import { IDIOMAS } from '@compartido';
import {
  JUEGOS, buscarCartasOficiales, hayNombreSuficiente, articuloDesdeCarta,
} from '../../servicios/cartasOficiales.js';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';

const ESPERA_MS = 600;

/**
 * Buscador de cartas oficiales (APIs gratuitas TCGdex, Scryfall y YGOPRODeck).
 * El cliente escribe el nombre, elige la versión exacta y se añade a su pedido con
 * expansión, año, número y rareza ya rellenos.
 */
export function BuscadorCartas({ alAnadir }) {
  const [nombre, setNombre] = useState('');
  const [juego, setJuego] = useState('pokemon');
  const [idioma, setIdioma] = useState('Español');
  const [estado, setEstado] = useState({ cargando: false, cartas: [], error: null });
  const [anadidas, setAnadidas] = useState([]);

  const buscable = hayNombreSuficiente(nombre);
  const fuente = JUEGOS.find((j) => j.id === juego)?.fuente;

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
        setEstado({ cargando: false, cartas: [], error: 'No se ha podido consultar la base de datos de cartas. Añade la carta a mano.' });
      }
    }, ESPERA_MS);
    return () => {
      clearTimeout(temporizador);
      control.abort();
    };
  }, [buscable, nombre, juego, idioma]);

  const anadir = (carta) => {
    alAnadir(articuloDesdeCarta(carta, idioma));
    setAnadidas((lista) => [...lista, carta.id]);
  };

  return (
    <section className="buscador-cartas" aria-labelledby="t-buscar-carta">
      <h3 id="t-buscar-carta">Busca tus cartas</h3>
      <div className="buscador-cartas-filtros">
        <label className="campo">
          <span>Nombre de la carta</span>
          <input className="entrada" type="search" value={nombre} onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Charizard" autoComplete="off" />
        </label>
        <label className="campo">
          <span>Juego</span>
          <select className="selector" value={juego} onChange={(e) => setJuego(e.target.value)}>
            {JUEGOS.map((j) => <option key={j.id} value={j.id}>{j.nombre}</option>)}
          </select>
        </label>
        <label className="campo">
          <span>Idioma de la carta</span>
          <select className="selector" value={idioma} onChange={(e) => setIdioma(e.target.value)}>
            {IDIOMAS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
      </div>

      {!buscable && <p className="pequeno">Escribe al menos 3 letras y elige la versión exacta que vas a enviarnos.</p>}
      {buscable && estado.cargando && <p className="pequeno" role="status">Buscando «{nombre.trim()}» en {fuente}…</p>}
      {estado.error && <Mensaje mensaje={{ tipo: 'error', texto: estado.error }} />}
      {buscable && !estado.cargando && !estado.error && estado.cartas.length === 0 && (
        <p className="pequeno" role="status">No hay cartas con ese nombre en {fuente}. Prueba con el nombre en inglés o añádela a mano.</p>
      )}

      {estado.cartas.length > 0 && !estado.cargando && (
        <ul className="lista-recomendaciones">
          {estado.cartas.map((c) => {
            const veces = anadidas.filter((id) => id === c.id).length;
            return (
              <li key={c.id} className={veces ? 'recomendacion elegida' : 'recomendacion'}>
                {c.imagen
                  ? <img src={c.imagen} alt="" loading="lazy" width="54" height="75" />
                  : <span className="recomendacion-sin-foto" aria-hidden="true">{c.nombre.slice(0, 1)}</span>}
                <div className="recomendacion-datos">
                  <strong>{c.nombre}</strong>
                  <span>{[c.expansion, c.anio].filter(Boolean).join(' · ')}</span>
                  <span className="mono">{[c.numero, c.rareza].filter(Boolean).join(' · ')}</span>
                </div>
                <Boton variante={veces ? 'oscuro' : 'contorno'} onClick={() => anadir(c)}
                  aria-label={`Añadir ${c.nombre} de ${c.expansion} al pedido`}>
                  {veces ? `Añadida (${veces})` : 'Añadir'}
                </Boton>
              </li>
            );
          })}
        </ul>
      )}
      {buscable && <p className="fuente-datos">Datos oficiales: {fuente} (API gratuita).</p>}
    </section>
  );
}
