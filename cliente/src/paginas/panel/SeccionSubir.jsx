import { useState } from 'react';
import { ESTADOS_ARTICULO, ESTADOS_PEDIDO, LIMITES, MOTIVOS_NO_GRADEABLE, calcularNotaFinal } from '@compartido';
import { api } from '../../servicios/index.js';
import { useCarga } from '../../hooks/useCarga.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import { useTituloPagina } from '../../hooks/useTituloPagina.js';
import { useRutas } from '../../enrutador/useRutas.js';
import { Enlace } from '../../enrutador/Enlace.jsx';
import { rutaConsulta } from '../../constantes/rutas.js';
import { SelectorFoto } from '../../componentes/panel/SelectorFoto.jsx';
import { FormularioProducto } from '../../componentes/panel/FormularioProducto.jsx';
import { PRODUCTO_VACIO, subnotasDe, prepararProducto, valoresDesdeIA, valoresDesdeArticulo } from '../../componentes/panel/opcionesProducto.js';
import { EtiquetaIGS } from '../../componentes/producto/EtiquetaIGS.jsx';
import { VisorEtiquetaTrasera } from '../../componentes/producto/VisorEtiquetaTrasera.jsx';
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

/** Siguiente artículo pendiente del pedido (sin contar el que se acaba de publicar), para seguir sin volver a elegirlo. */
const siguienteArticulo = (pedido, actual) => {
  const indice = (pedido?.articulos ?? []).findIndex((a, i) => i !== actual && a.estado === ESTADOS_ARTICULO.PENDIENTE);
  return indice === -1 ? null : indice;
};

/** Lo que se ve en la vista previa de la etiqueta mientras se rellena el formulario. */
const vistaPrevia = (valores) => {
  const subnotas = subnotasDe(valores);
  return {
    nombre: valores.nombre,
    anio: valores.anio,
    expansion: valores.expansion,
    nota: calcularNotaFinal(subnotas) ?? '',
    subnotas,
  };
};

/** Devolver el artículo sin encapsular (alterado, falso…), como los códigos «N» de PSA. */
function NoGradeable({ pedido, articulo, alMarcar }) {
  const [motivo, setMotivo] = useState(MOTIVOS_NO_GRADEABLE[0]);
  const [estado, setEstado] = useState(null);
  const listo = pedido && articulo !== '';

  const marcar = async () => {
    setEstado(null);
    try {
      await api.pedidos.noGradeable(pedido, Number(articulo), motivo);
      setEstado({ tipo: 'ok', texto: 'Artículo marcado como no gradeable. Se devolverá sin encapsular.' });
      alMarcar();
    } catch (e) {
      setEstado({ tipo: 'error', texto: e.message });
    }
  };

  return (
    <div className="no-gradeable">
      <label className="campo" htmlFor="p-motivo">
        <span>¿No se puede gradear?</span>
        <select id="p-motivo" className="selector" value={motivo} onChange={(e) => setMotivo(e.target.value)} disabled={!listo}>
          {MOTIVOS_NO_GRADEABLE.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <Boton variante="contorno" onClick={marcar} disabled={!listo}>Marcar no gradeable</Boton>
      <div className="completo"><Mensaje mensaje={estado} /></div>
    </div>
  );
}

/**
 * Gradeo de un artículo declarado por el cliente: fotos, lectura automática de la etiqueta,
 * subnotas con la nota final calculada, vista previa de la etiqueta IGS y publicación del certificado.
 */
export function SeccionSubir() {
  useTituloPagina('Gradear artículos');
  const { query } = useRutas();
  const [fotos, setFotos] = useState(SIN_FOTOS);
  const [guardado, setGuardado] = useState(null);
  const [capa, setCapa] = useState('etiquetas');

  /** Imprime una capa: primero las etiquetas en color y después, en la misma hoja, el código con el cartucho de tinta UV. */
  const imprimir = (nueva) => {
    setCapa(nueva);
    setTimeout(() => window.print(), 50);
  };
  const [estadoIA, setEstadoIA] = useState(null);
  const { datos: pedidos, recargar } = useCarga(() => api.pedidos.cola(ESTADOS_PEDIDO.EN_GRADEO));

  const inicial = { ...PRODUCTO_VACIO, pedido: query.get('pedido') ?? '' };
  const formulario = useFormulario({
    inicial,
    esquema: 'producto',
    preparar: prepararProducto,
    alEnviar: async (datos) => {
      const grande = Object.values(fotos).find((f) => f && f.size > LIMITES.FOTO_MB * 1024 * 1024);
      if (grande) throw new Error(`«${grande.name}» pesa más de ${LIMITES.FOTO_MB} MB. Hazla más pequeña y vuelve a elegirla.`);
      const producto = await api.productos.crear(datos, fotos);
      setGuardado(producto);
      setFotos(SIN_FOTOS);
      const pedido = (pedidos ?? []).find((p) => p.codigo === datos.pedido);
      const siguiente = siguienteArticulo(pedido, datos.articulo);
      formulario.reiniciar(siguiente == null
        ? { ...PRODUCTO_VACIO, pedido: datos.pedido }
        : { ...PRODUCTO_VACIO, pedido: datos.pedido, articulo: String(siguiente), ...valoresDesdeArticulo(pedido.articulos[siguiente]) });
      await recargar();
      return `Certificado ${producto.idCertificado} publicado.`;
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
      <h1 id="t-subir">Gradear artículos</h1>
      <p className="apagado">Elige el artículo, revisa sus datos, pon las subnotas y sube las fotos. La etiqueta de la derecha se actualiza mientras rellenas.</p>
      <Tarjeta como="div" className="subida">
        <div className="subida-ficha">
          <FormularioProducto formulario={formulario} pedidos={pedidos ?? []} fotos={(
            <div className="subida-fotos">
              {FOTOS.map((f) => <SelectorFoto key={f.campo} campo={f.campo} etiqueta={f.texto} archivo={fotos[f.campo]} alCambiar={cambiarFoto} />)}
              <div className="subida-ia">
                <Boton variante="contorno" onClick={leerConIA} disabled={!fotos.etiqueta}>
                  <Icono nombre="chispa" tamano={18} /> Leer etiqueta y autorrellenar
                </Boton>
                <p className="pequeno">{fotos.etiqueta ? 'Se leen los datos de la etiqueta y se rellena el formulario.' : 'Opcional: con la foto de la etiqueta se pueden leer los datos automáticamente.'}</p>
                <Mensaje mensaje={estadoIA} />
              </div>
            </div>
          )} />
        </div>
        <aside className="subida-lateral" aria-label="Vista previa y artículos no gradeables">
          <div className="vista-etiqueta">
            <h2>Vista previa de la etiqueta</h2>
            <EtiquetaIGS producto={vistaPrevia(formulario.valores)} />
          </div>
          <NoGradeable pedido={formulario.valores.pedido} articulo={formulario.valores.articulo}
            alMarcar={() => { formulario.rellenar({ articulo: '' }); recargar(); }} />
        </aside>
      </Tarjeta>
      {guardado && (
        <Tarjeta como="div" className={`etiqueta-guardada zona-impresion capa-${capa}`}>
          <h2 className="no-imprimir">Etiqueta de {guardado.idCertificado}</h2>
          <div className="etiquetas-par">
            <EtiquetaIGS producto={guardado} />
            <VisorEtiquetaTrasera producto={guardado} codigoUV={guardado.codigoUV} />
          </div>
          <p className="pequeno no-imprimir">
            Código UV de este slab: <strong className="mono">{guardado.codigoUV}</strong>. Imprime primero las etiquetas y, sin mover la hoja,
            la capa UV con el cartucho de tinta UV invisible. El código no aparece en la ficha pública.
          </p>
          <div className="acciones no-imprimir">
            <Boton variante="oscuro" onClick={() => imprimir('etiquetas')}>1. Imprimir etiquetas</Boton>
            <Boton variante="contorno" onClick={() => imprimir('uv')}>2. Imprimir capa UV</Boton>
            <Enlace href={rutaConsulta(guardado.idCertificado)}>Ver la ficha pública</Enlace>
          </div>
        </Tarjeta>
      )}
    </section>
  );
}
