import { useState } from 'react';
import { validarCon } from '@compartido';
import { api } from '../../servicios/index.js';
import { Boton } from '../ui/Boton.jsx';
import { CampoTexto } from '../ui/CampoTexto.jsx';
import { Mensaje } from '../ui/Mensaje.jsx';

/**
 * Verificación anti-réplica: el comprador alumbra la etiqueta trasera con una lámpara UV,
 * escribe el código que aparece y IGS le dice si corresponde a este certificado.
 */
export function VerificarUV({ idCertificado }) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const comprobar = async (e) => {
    e.preventDefault();
    const errores = validarCon('verificarUV', { codigo });
    setError(errores.codigo ?? null);
    setResultado(null);
    if (errores.codigo) return;
    setEnviando(true);
    try {
      const { valido } = await api.productos.verificarUV(idCertificado, codigo);
      setResultado(valido
        ? { tipo: 'ok', texto: 'El código UV coincide: el slab es auténtico y corresponde a este certificado.' }
        : { tipo: 'error', texto: 'El código UV no coincide con este certificado. Podría ser una réplica: no lo compres y contacta con IGS.' });
    } catch (err) {
      setResultado({ tipo: 'error', texto: err.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="verificar-uv" onSubmit={comprobar} noValidate aria-labelledby="t-verificar-uv">
      <h2 id="t-verificar-uv">Comprueba el código UV</h2>
      <p className="pequeno">
        Alumbra la parte trasera del slab con una lámpara de luz ultravioleta (365 nm). Aparecerá un código de 8 caracteres
        que solo IGS puede generar para este certificado.
      </p>
      <div className="verificar-uv-fila">
        <CampoTexto id="codigo-uv" etiqueta="Código UV" mono placeholder="7QK2-M9XD" autoComplete="off" maxLength={12}
          value={codigo} onChange={(e) => { setCodigo(e.target.value); setError(null); }} error={error} />
        <Boton type="submit" variante="oscuro" disabled={enviando}>{enviando ? 'Comprobando…' : 'Comprobar'}</Boton>
      </div>
      <Mensaje mensaje={resultado} />
    </form>
  );
}
