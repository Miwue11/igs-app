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

/** Gestión de usuarios (solo administradores). Nadie puede cambiar su propio rol. */
export function TablaUsuarios({ usuarios, yo, alCambiarRol }) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <caption className="solo-lectores">Usuarios registrados</caption>
        <thead>
          <tr><th>Nombre</th><th>Email</th><th>Alta</th><th>Rol</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}{u.id === yo.id && <span className="pequeno"> (tú)</span>}</td>
              <td>{u.email}</td>
              <td>{formatoFecha(u.creadoEn)}</td>
              <td><SelectorRol usuario={u} esYo={u.id === yo.id} alCambiar={alCambiarRol} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
