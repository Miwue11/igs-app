import { TarjetaServicio } from './TarjetaServicio.jsx';

export function RejillaServicios({ servicios, alSolicitar }) {
  if (servicios.length === 0) return <p className="apagado">No hay servicios en esta categoría.</p>;
  return (
    <div className="servicios" aria-live="polite">
      {servicios.map((s) => <TarjetaServicio key={s.codigo} servicio={s} alSolicitar={alSolicitar} />)}
    </div>
  );
}
