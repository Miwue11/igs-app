import { useEffect, useState } from 'react';

/** Crea una URL temporal para previsualizar un archivo de imagen y la libera al cambiar. */
export function useVistaPrevia(archivo) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!archivo) return setUrl(null);
    const nueva = URL.createObjectURL(archivo);
    setUrl(nueva);
    return () => URL.revokeObjectURL(nueva);
  }, [archivo]);
  return url;
}
