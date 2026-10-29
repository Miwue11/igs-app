import { useState } from 'react';
import { ESTADOS_PEDIDO } from '@compartido';
import { api } from '../../servicios/index.js';
import { useCarga } from '../../hooks/useCarga.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import { useTituloPagina } from '../../hooks/useTituloPagina.js';
import { useRutas } from '../../enrutador/useRutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { rutaConsulta } from '../../constantes/rutas.js';
import { SelectorFoto } from '../../componentes/panel/SelectorFoto.jsx';
import { FormularioProducto } from '../../componentes/panel/FormularioProducto.jsx';
import { PRODUCTO_VACIO, prepararProducto, valoresDesdeIA } from '../../componentes/panel/opcionesProducto.js';
import { Boton } from '../../componentes/ui/Boton.jsx';
import { Icono } from '../../componentes/ui/Icono.jsx';
import { Mensaje } from '../../componentes/ui/Mensaje.jsx';
import { Tarjeta } from '../../componentes/ui/Tarjeta.jsx';

const FOTOS = [
  { campo: 'etiqueta', texto: 'Foto de la etiqueta' },
  { campo: 'anverso', texto: 'Foto del anverso' },
  { campo: 'reverso', texto: 'Foto del reverso' },
];
const SIN_FOTOS = { etiqueta: null, anverso: null, reverso: null };

/** Subida de un producto gradeado: fotos, lectura automática de la etiqueta y ficha. */
export function SeccionSubir() {
  useTituloPagina('Subir producto');
  const { query } = useRutas();
  const [fotos, setFotos] = useState(SIN_FOTOS);
  const [guardado, setGuardado] = useState(null);
  const [estadoIA, setEstadoIA] = useState(null);
  const { datos: pedidos } = useCarga(() => api.pedidos.cola(ESTADOS_PEDIDO.EN_GRADEO));

  const inicial = { ...PRODUCTO_VACIO, pedido: query.get('pedido') ?? '' };
  const formulario = useFormulario({
    inicial,
    esquema: 'producto',
    preparar: prepararProducto,
    alEnviar: async (datos) => {
      const producto = await api.productos.crear(datos, fotos);
      setGuardado(producto);
      setFotos(SIN_FOTOS);
      formulario.reiniciar({ ...PRODUCTO_VACIO, pedido: datos.pedido });
      return `Producto guardado con el ID ${producto.idCertificado}.`;
    },
  });

  const cambiarFoto = (campo, archivo) => setFotos((previas) => ({ ...previas, [campo]: archivo }));

  const leerConIA = async () => {
    setEstadoIA({ tipo: 'info', texto: 'Leyendo la etiqueta…' });
    try {
      const campos = await api.ia.leerEtiqueta(fotos.etiqueta);
      formulario.rellenar(valoresDesdeIA(campos));
      setEstadoIA({ tipo: 'ok', texto: 'Datos leídos de la etiqueta. Revísalos antes de guardar.' });
    } catch (e) {
      setEstadoIA({ tipo: 'error', texto: e.message });
    }
  };

  return (
    <section aria-labelledby="t-subir">
      <h1 id="t-subir">Subir producto gradeado</h1>
      <Tarjeta como="div" className="subida">
        <div className="subida-fotos">
          {FOTOS.map((f) => <SelectorFoto key={f.campo} campo={f.campo} etiqueta={f.texto} archivo={fotos[f.campo]} alCambiar={cambiarFoto} />)}
          <Boton variante="dorado" grande onClick={leerConIA} disabled={!fotos.etiqueta}>
            <Icono nombre="chispa" tamano={18} /> Leer etiqueta y autorrellenar
          </Boton>
          <p className="pequeno">{fotos.etiqueta ? 'Se leen los datos de la etiqueta y se rellena el formulario.' : 'Sube la foto de la etiqueta para leerla automáticamente.'}</p>
          <Mensaje mensaje={estadoIA} />
        </div>
        <FormularioProducto formulario={formulario} pedidos={pedidos ?? []} />
      </Tarjeta>
      {guardado && (
        <p className="aclaracion">Último guardado: <Enlace href={rutaConsulta(guardado.idCertificado)}>ver la ficha pública de {guardado.idCertificado}</Enlace></p>
      )}
    </section>
  );
}
