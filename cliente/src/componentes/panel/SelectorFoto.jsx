import { useVistaPrevia } from '../../hooks/useVistaPrevia.js';
import { Icono } from '../ui/Icono.jsx';

/** Zona para elegir una foto, con vista previa. */
export function SelectorFoto({ campo, etiqueta, archivo, alCambiar }) {
  const vista = useVistaPrevia(archivo);
  const id = `foto-${campo}`;

  return (
    <div className="selector-foto">
      <label className="zona-foto" htmlFor={id}>
        {vista ? <img src={vista} alt={`Vista previa: ${etiqueta}`} /> : <Icono nombre="subir" tamano={28} />}
        <span>{archivo ? archivo.name : etiqueta}</span>
      </label>
      <input id={id} type="file" accept="image/*" className="solo-lectores" onChange={(e) => alCambiar(campo, e.target.files[0] ?? null)} />
    </div>
  );
}
