import { ROLES, ETIQUETAS_ROL } from '@compartido';
import { formatoFecha } from '../../utilidades/formato.js';

function SelectorRol({ usuario, esYo, alCambiar }) {
  return (
    <>
      <label htmlFor={`rol-${usuario.id}`} className="solo-lectores">Rol de {usuario.nombre}</label>
      <select id={`rol-${usuario.id}`} className="selector selector-pequeno" value={usuario.rol} disabled={esYo}
        onChange={(e) => alCambiar(usuario, e.target.value)}>
        {Object.values(ROLES).map((r) => <option key={r} value={r}>{ETIQUETAS_ROL[r]}</option>)}
      </select>
    </>
  );
}

/** Interruptor para activar o desactivar la cuenta. */
function InterruptorActivo({ usuario, esYo, alCambiar }) {
  const activo = usuario.activo !== false;
  return (
    <label className="interruptor">
      <input type="checkbox" role="switch" checked={activo} disabled={esYo} onChange={() => alCambiar(usuario, !activo)} />
      <span className="interruptor-pista" aria-hidden="true" />
      <span>{activo ? 'Activa' : 'Desactivada'}</span>
      <span className="solo-lectores"> · cuenta de {usuario.nombre}</span>
    </label>
  );
}

/** Gestión de usuarios (solo administradores). Nadie puede cambiar su propio rol ni desactivarse. */
export function TablaUsuarios({ usuarios, yo, alCambiarRol, alCambiarActivo }) {
  if (usuarios.length === 0) return <p className="apagado">Ningún usuario coincide con la búsqueda.</p>;
  return (
    <div className="tabla-contenedor">
      <table className="tabla tabla-adaptable">
        <caption className="solo-lectores">Usuarios registrados</caption>
        <thead>
          <tr><th>Nombre</th><th>Email</th><th>Alta</th><th>Rol</th><th>Cuenta</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className={u.activo === false ? 'fila-inactiva' : undefined}>
              <td className="celda-titulo">{u.nombre}{u.id === yo.id && <span className="pequeno"> (tú)</span>}</td>
              <td data-etiqueta="Email">{u.email}</td>
              <td data-etiqueta="Alta">{formatoFecha(u.creadoEn)}</td>
              <td data-etiqueta="Rol"><SelectorRol usuario={u} esYo={u.id === yo.id} alCambiar={alCambiarRol} /></td>
              <td data-etiqueta="Cuenta"><InterruptorActivo usuario={u} esYo={u.id === yo.id} alCambiar={alCambiarActivo} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
