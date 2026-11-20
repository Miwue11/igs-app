import { useEffect } from 'react';
import { useRutas } from '../enrutador/useRutas.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { Enlace } from '../enrutador/Enlace.jsx';
import { RUTAS } from '../constantes/rutas.js';
import { SECCIONES_LEGALES } from '../constantes/legal.js';

/** Aviso legal, privacidad y cookies en una sola página; ?seccion= lleva directamente a cada apartado. */
export function PaginaLegal() {
  useTituloPagina('Información legal');
  const { query } = useRutas();
  const seccion = query.get('seccion');

  useEffect(() => {
    if (seccion) document.getElementById(seccion)?.scrollIntoView({ block: 'start' });
  }, [seccion]);

  return (
    <div className="pagina">
      <div className="contenedor pagina-estrecha">
        <nav className="miga" aria-label="Ruta"><Enlace href={RUTAS.INICIO}>Inicio</Enlace> / Información legal</nav>
        <div className="pagina-cabecera">
          <h1>Información legal</h1>
          <p>IGS es una empresa ficticia creada para un proyecto académico. Estos textos muestran cómo se organizaría la información legal de un servicio real.</p>
        </div>
        <nav className="indice-legal" aria-label="Apartados">
          {SECCIONES_LEGALES.map((s) => <Enlace key={s.id} href={`${RUTAS.LEGAL}?seccion=${s.id}`}>{s.titulo}</Enlace>)}
        </nav>
        {SECCIONES_LEGALES.map((s) => (
          <section key={s.id} id={s.id} className="tarjeta texto-legal" aria-labelledby={`t-${s.id}`}>
            <h2 id={`t-${s.id}`}>{s.titulo}</h2>
            {s.parrafos.map((p) => <p key={p}>{p}</p>)}
          </section>
        ))}
      </div>
    </div>
  );
}
