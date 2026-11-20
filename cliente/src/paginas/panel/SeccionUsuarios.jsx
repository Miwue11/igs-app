import { useState } from 'react';
import { ROLES, ETIQUETAS_ROL } from '@compartido';
import { api } from '../../servicios/index.js';
import { useSesion } from '../../hooks/useSesion.js';
import { useCarga } from '../../hooks/useCarga.js';
import { useTituloPagina } from '../../hooks/useTituloPagina.js';
import { TablaUsuarios } from '../../componentes/panel/TablaUsuarios.jsx';
import { Aviso } from '../../componentes/ui/Aviso.jsx';
import { Cargando } from '../../componentes/ui/Cargando.jsx';

const normalizar = (texto) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const coincide = (usuario, busqueda, rol) =>
  (!rol || usuario.rol === rol)
  && (!busqueda || normalizar(`${usuario.nombre} ${usuario.email}`).includes(normalizar(busqueda.trim())));

export function SeccionUsuarios() {
  useTituloPagina('Usuarios');
  const { usuario: yo } = useSesion();
  const [aviso, setAviso] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('');
  const { datos: usuarios, error, cargando, cambiarDatos } = useCarga(api.usuarios.listar);

  const sustituir = (actualizado) => cambiarDatos((lista) => lista.map((u) => (u.id === actualizado.id ? actualizado : u)));

  const cambiarRol = async (usuario, nuevo) => {
    try {
      const actualizado = await api.usuarios.cambiarRol(usuario.id, nuevo);
      sustituir(actualizado);
      setAviso({ tipo: 'ok', texto: `${actualizado.nombre} ahora es ${ETIQUETAS_ROL[nuevo]}.` });
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    }
  };

  const cambiarActivo = async (usuario, activo) => {
    try {
      const actualizado = await api.usuarios.cambiarActivo(usuario.id, activo);
      sustituir(actualizado);
      setAviso({ tipo: 'ok', texto: `La cuenta de ${actualizado.nombre} está ${activo ? 'activa' : 'desactivada: ya no puede iniciar sesión'}.` });
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    }
  };

  const visibles = (usuarios ?? []).filter((u) => coincide(u, busqueda, rol));

  return (
    <section aria-labelledby="t-usuarios">
      <div>
        <h1 id="t-usuarios">Usuarios</h1>
        <p className="apagado">Cambia el perfil de cada cuenta o desactívala. Una cuenta desactivada no puede iniciar sesión, pero conserva sus pedidos.</p>
      </div>
      <div className="barra-herramientas" role="search">
        <label htmlFor="u-buscar" className="solo-lectores">Buscar por nombre o email</label>
        <input id="u-buscar" type="search" className="entrada entrada-busqueda" placeholder="Buscar por nombre o email"
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <label htmlFor="u-rol" className="solo-lectores">Filtrar por rol</label>
        <select id="u-rol" className="selector" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Todos los roles</option>
          {Object.values(ROLES).map((r) => <option key={r} value={r}>{ETIQUETAS_ROL[r]}</option>)}
        </select>
        {usuarios && <span className="pequeno contador-resultados">{visibles.length} de {usuarios.length}</span>}
      </div>
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      {cargando && <Cargando />}
      {error && <Aviso tipo="error">{error.message}</Aviso>}
      {usuarios && <TablaUsuarios usuarios={visibles} yo={yo} alCambiarRol={cambiarRol} alCambiarActivo={cambiarActivo} />}
    </section>
  );
}
