import { LIMITES } from '@compartido';
import { useVistaPrevia } from '../../hooks/useVistaPrevia.js';
import { Icono } from '../ui/Icono.jsx';

const MAXIMO = LIMITES.FOTO_MB * 1024 * 1024;

/** Zona para elegir una foto, con vista previa. Avisa si supera el tamaño máximo que admite el servidor. */
export function SelectorFoto({ campo, etiqueta, archivo, alCambiar }) {
  const vista = useVistaPrevia(archivo);
  const id = `foto-${campo}`;
  const grande = archivo && archivo.size > MAXIMO;

  const elegir = (e) => {
    const nuevo = e.target.files[0] ?? null;
    alCambiar(campo, nuevo);
    e.target.value = '';
  };

  return (
    <div className="selector-foto">
      <label className="zona-foto" htmlFor={id}>
        {vista ? <img src={vista} alt={`Vista previa: ${etiqueta}`} /> : <Icono nombre="subir" tamano={28} />}
        <span>{archivo ? archivo.name : etiqueta}</span>
      </label>
      <input id={id} type="file" accept="image/jpeg,image/png,image/webp" className="solo-lectores" onChange={elegir} />
      {grande && <p className="campo-error">La foto pesa más de {LIMITES.FOTO_MB} MB. Hazla más pequeña antes de subirla.</p>}
    </div>
  );
}
