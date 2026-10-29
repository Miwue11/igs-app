import { useState } from 'react';
import { validarCon, normalizarIdCertificado } from '@compartido';
import { clases } from '../../utilidades/clases.js';
import { Boton } from '../ui/Boton.jsx';
import { atributosError } from '../ui/Campo.jsx';

const ESTILOS = {
  portada: { formulario: 'portada-buscador', boton: 'dorado', etiqueta: 'Consulta un producto gradeado' },
  barra: { formulario: 'barra-busqueda', boton: 'oscuro', etiqueta: 'ID de certificación' },
};

/** Formulario para buscar un producto por su ID. Se usa en la portada y en la página de consulta. */
export function BuscadorCertificado({ variante = 'barra', inicial = '', alBuscar }) {
  const [texto, setTexto] = useState(inicial);
  const [error, setError] = useState(null);
  const estilo = ESTILOS[variante];
  const id = `buscar-${variante}`;

  const enviar = (e) => {
    e.preventDefault();
    const fallo = validarCon('consulta', { id: texto }).id ?? null;
    setError(fallo);
    if (!fallo) alBuscar(normalizarIdCertificado(texto));
  };

  return (
    <form className={estilo.formulario} onSubmit={enviar} noValidate role="search">
      <div className="campo">
        <label htmlFor={id}>{estilo.etiqueta}</label>
        <div className="en-linea">
          <input
            id={id} name="id" type="text" className={clases('entrada', 'mono')} value={texto}
            onChange={(e) => setTexto(e.target.value)} placeholder="Ej. IGS-2026-000001" autoComplete="off"
            {...atributosError(id, error)}
          />
          <Boton type="submit" variante={estilo.boton} grande>{variante === 'portada' ? 'Consultar' : 'Buscar'}</Boton>
        </div>
        {error && <p className="campo-error" id={`${id}-error`}>{error}</p>}
      </div>
    </form>
  );
}
