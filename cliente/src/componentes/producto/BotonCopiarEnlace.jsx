import { useState } from 'react';
import { Boton } from '../ui/Boton.jsx';

const TEXTOS = { listo: 'Copiar enlace público', copiado: 'Enlace copiado', fallo: 'No se pudo copiar' };

export function BotonCopiarEnlace() {
  const [estado, setEstado] = useState('listo');

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setEstado('copiado');
    } catch {
      setEstado('fallo');
    }
    setTimeout(() => setEstado('listo'), 2000);
  };

  return <Boton variante="contorno" onClick={copiar}>{TEXTOS[estado]}</Boton>;
}
