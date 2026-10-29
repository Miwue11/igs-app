import { useContext } from 'react';
import { ContextoSesion } from '../contexto/ContextoSesion.jsx';

/** { usuario, cargando, entrar, registrarse, salir } */
export const useSesion = () => useContext(ContextoSesion);
