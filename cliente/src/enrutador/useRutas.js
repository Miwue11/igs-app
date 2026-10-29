import { useContext } from 'react';
import { ContextoRutas } from './ProveedorRutas.jsx';

/** Ruta actual, parámetros de la URL y función para navegar. */
export const useRutas = () => useContext(ContextoRutas);
