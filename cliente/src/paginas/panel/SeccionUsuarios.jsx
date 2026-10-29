import { useState } from 'react';
import { ETIQUETAS_ROL } from '@compartido';
import { api } from '../../servicios/index.js';
import { useSesion } from '../../hooks/useSesion.js';
import { useCarga } from '../../hooks/useCarga.js';
import { useTituloPagina } from '../../hooks/useTituloPagina.js';
import { TablaUsuarios } from '../../componentes/panel/TablaUsuarios.jsx';
import { Aviso } from '../../componentes/ui/Aviso.jsx';
import { Cargando } from '../../componentes/ui/Cargando.jsx';

export function SeccionUsuarios() {
  useTituloPagina('Usuarios');
  const { usuario: yo } = useSesion();
  const [aviso, setAviso] = useState(null);
  const { datos: usuarios, error, cargando, cambiarDatos } = useCarga(api.usuarios.listar);

  const cambiarRol = async (usuario, rol) => {
    try {
      const actualizado = await api.usuarios.cambiarRol(usuario.id, rol);
      cambiarDatos((lista) => lista.map((u) => (u.id === actualizado.id ? actualizado : u)));
      setAviso({ tipo: 'ok', texto: `${actualizado.nombre} ahora es ${ETIQUETAS_ROL[rol]}.` });
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    }
  };

  return (
    <section aria-labelledby="t-usuarios">
      <h1 id="t-usuarios">Usuarios</h1>
      <p className="apagado">Cambia el perfil de cada cuenta: cliente, trabajador o administrador.</p>
      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      {cargando && <Cargando />}
      {error && <Aviso tipo="error">{error.message}</Aviso>}
      {usuarios && <TablaUsuarios usuarios={usuarios} yo={yo} alCambiarRol={cambiarRol} />}
    </section>
  );
}
