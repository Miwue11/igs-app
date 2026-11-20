import { useEffect, useState } from 'react';
import { IDIOMAS } from '@compartido';
import {
  JUEGOS, buscarCartasOficiales, cargarJuegos, hayNombreSuficiente, articuloDesdeCarta,
} from '../../servicios/cartasOficiales.js';
import { useCarga } from '../../hooks/useCarga.js';
import { Boton } from '../ui/Boton.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';

const ESPERA_MS = 600;

/** Juegos con fuente propia primero; después, por orden alfabético, los del catálogo de CardTrader. */
const GRUPOS = [
  { titulo: 'Con base de datos oficial', filtro: (j) => j.fuente !== 'CardTrader' },
  { titulo: 'Catálogo de CardTrader', filtro: (j) => j.fuente === 'CardTrader' },
];

/** Si una miniatura no carga, se cambia por la inicial (como cuando la fuente no tiene imagen). */
function Miniatura({ carta }) {
  const [rota, setRota] = useState(false);
  if (!carta.imagen || rota) return <span className="recomendacion-sin-foto" aria-hidden="true">{carta.nombre.slice(0, 1)}</span>;
  return <img src={carta.imagen} alt="" loading="lazy" width="54" height="75" onError={() => setRota(true)} />;
}

/**
 * Buscador de cartas oficiales (TCGdex, Scryfall, YGOPRODeck, Lorcast, OPTCG API, digimoncard.io y CardTrader).
 * El cliente escribe el nombre, elige la versión exacta y se añade a su pedido con
 * expansión, año, número y rareza ya rellenos.
 */
export function BuscadorCartas({ alAnadir }) {
  const [nombre, setNombre] = useState('');
  const [juego, setJuego] = useState('pokemon');
  const [idioma, setIdioma] = useState('Español');
  const [estado, setEstado] = useState({ cargando: false, cartas: [], error: null });
  const [anadidas, setAnadidas] = useState([]);

  const { datos: juegos } = useCarga(cargarJuegos);
  const lista = juegos ?? JUEGOS;
  const buscable = hayNombreSuficiente(nombre);
  const fuente = lista.find((j) => j.id === juego)?.fuente ?? 'la base de datos';

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
        if (control.signal.aborted) return;
        setEstado({ cargando: false, cartas, error: null });
      } catch (e) {
        if (e.name === 'AbortError' || control.signal.aborted) return;
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
            {GRUPOS.map((g) => {
              const suyos = lista.filter(g.filtro);
              return suyos.length === 0 ? null : (
                <optgroup key={g.titulo} label={g.titulo}>
                  {suyos.map((j) => <option key={j.id} value={j.id}>{j.nombre}</option>)}
                </optgroup>
              );
            })}
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
                <Miniatura carta={c} />
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
      {buscable && <p className="fuente-datos">Datos: {fuente}.</p>}
    </section>
  );
}
