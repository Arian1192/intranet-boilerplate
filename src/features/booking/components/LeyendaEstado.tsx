/**
 * La leyenda de estado de `/shows` — calco del live del 2026-09-09.
 *
 * Explica los cuatro estados que puede tener cada segmento del `track` de una
 * fila. Son **cuatro**, no tres: el cuarto —«Atención»— es el que corresponde al
 * borde izquierdo `h-alert`, que llevan 68 de las 87 filas del live.
 *
 * Los colores salen de los tokens de la capa `apxlist` (`--mint`, `--amber`,
 * `--canvas-2`, `--rose`), no de la rampa de Tailwind: así responden al modo
 * noche igual que el resto de la lista. Medidos en el live y coincidentes:
 * `rgb(22,199,154)`, `rgb(245,165,36)`, `rgb(238,238,246)` y `rgb(242,84,123)`.
 */
const ESTADOS: { texto: string; fondo: string; borde?: boolean }[] = [
  { texto: 'Hecho', fondo: 'var(--mint)' },
  { texto: 'En curso / pendiente', fondo: 'var(--amber)' },
  { texto: 'Sin empezar', fondo: 'var(--canvas-2)', borde: true },
  { texto: 'Atención · avanzando con un requisito bloqueante sin resolver', fondo: 'var(--rose)' },
];

export function LeyendaEstado() {
  return (
    <div className="apxlist mb-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-[11.5px] text-[var(--muted)]">
        {ESTADOS.map((estado) => (
          <span key={estado.texto} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full${
                estado.borde ? ' border border-[var(--line)]' : ''
              }`}
              style={{ background: estado.fondo }}
            />
            {estado.texto}
          </span>
        ))}
      </div>
    </div>
  );
}
