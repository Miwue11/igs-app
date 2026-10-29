import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Aplicacion } from './Aplicacion.jsx';
import './estilos/indice.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
);
