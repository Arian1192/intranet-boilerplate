import type { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { formatCurrency } from '@/lib/format';
import type { PaymentStatus, Show, ShowFase } from '@/types';
import { SEGMENTOS_TRACK, bordeDeTrack, trackDeFase, type EstadoSegmento } from '../data/trackShow';

export interface ShowCardProps {
  show: Show;
}

/**
 * Enseñar la foto del artista en el avatar. **Apagada a propósito.**
 *
 * El live sirve esas fotos desde `i.scdn.co`, la CDN de Spotify, y hotlinkearlas
 * ataría la pantalla a un tercero y a que haya red. Misma decisión que se tomó
 * en `/artistas`: se pintan las iniciales. El día que el dato traiga una URL
 * propia, se guarda en el fichero de datos y esta constante la enciende.
 */
const MOSTRAR_FOTOS = false;

/** `Sera De Villalta` → `SV`; `Abdon` → `AB`. */
function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/);
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
}

/** Rótulo y color de la píldora de fase, medidos en las 87 filas del live. */
const FPILL: Record<ShowFase, { texto: string; tono: string }> = {
  tentative: { texto: 'Tentative', tono: 'p-none' },
  confirmed: { texto: 'Confirmado', tono: 'p-accent' },
  contract: { texto: 'Contrato', tono: 'p-accent' },
  pagos: { texto: 'Pagos', tono: 'p-amber' },
  liquidacion: { texto: 'Liquidación', tono: 'p-mint' },
  liquidado: { texto: 'Cerrado', tono: 'p-mint' },
  cancelado: { texto: 'Cancelado', tono: 'p-rose' },
};

/**
 * Tono del chip de dinero.
 *
 * Sólo uno está medido: en el live, `Liquidado` va en `p-mint`. Los otros cuatro
 * son etiquetas **nuestras** que el live no usa —su chip habla de cobro
 * (`Sin cobrar`, `No facturado`…) y el nuestro de liquidación—, así que su tono
 * va por analogía y queda declarado como tal. Ver
 * `docs/coordination/2026-09-09-dos-ejes-de-pago.md`.
 */
const TONO_PAGO: Record<PaymentStatus, string> = {
  'No abonado': 'p-rose',
  'Parcialmente abonado': 'p-amber',
  'Pendiente liquidar': 'p-amber',
  Liquidado: 'p-mint',
  Incidencia: 'p-rose',
};

/** El `title` del live escribe el estado en castellano: «Confirm.: Hecho». */
const ROTULO_ESTADO: Record<EstadoSegmento, string> = {
  done: 'Hecho',
  prog: 'En curso',
  alert: 'Atención',
  none: 'Sin empezar',
};

const ICONO: Record<EstadoSegmento, ReactElement> = {
  done: <path d="M20 6L9 17l-5-5" />,
  prog: <path d="M12 4a8 8 0 1 1-8 8" />,
  alert: <path d="M12 4l9 16H3zM12 10v4M12 17h.01" />,
  none: <circle cx="12" cy="12" r="8" />,
};

/**
 * Una fila de `/shows` — calco del `srow` del live del 2026-09-09.
 *
 * Usa la capa `apxlist` que la Fase 0 no había copiado y que se añadió a
 * `apx.css` en su propio commit: la lista del live no es esta tarjeta con otras
 * clases, es otro componente.
 *
 * El `track` de seis segmentos **no se calca, se deriva**, y está declarado en
 * `trackShow.ts`: en el live cada segmento es un sub-estado real de ese show y
 * nuestros 14 shows no tienen ese dato.
 *
 * La fila es un `button` que **navega al detalle**, como en el live: medido el
 * 2026-09-09, pulsar una fila lleva a `/shows/<uuid>`. Esa ruta se registró
 * contra un stub en su propio commit; el cuerpo de la pantalla es otra fase.
 */
export function ShowCard({ show }: ShowCardProps) {
  const navegar = useNavigate();
  const [dia, mes] = show.date ? show.date.split(/\s+/) : ['—', ''];
  const track = trackDeFase(show.fase);
  const fpill = FPILL[show.fase];
  const ubicacion = [show.venue, show.country].filter(Boolean).join(', ');

  return (
    <button
      type="button"
      onClick={() => navegar(`/shows/${show.id}`)}
      className={`srow ${bordeDeTrack(track)}`}
    >
      <div className="rdate">
        <div className="d">{dia}</div>
        <div className="m">{mes}</div>
      </div>

      <div className="ravatar">
        {MOSTRAR_FOTOS ? null : (
          <div
            title={show.artist}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white bg-[var(--canvas-2)] text-xs font-semibold text-[var(--muted)] shadow-sm"
          >
            {iniciales(show.artist)}
          </div>
        )}
      </div>

      <div className="rinfo">
        <div className="nm">
          <span className="min-w-0 flex-1 truncate">
            {show.artist} @ {show.event}
          </span>
          {show.exception && <span className="exc">Excepción</span>}
        </div>
        <div className="sub">
          <span className={`fpill ${fpill.tono}`}>{fpill.texto}</span>
          <span className="co">{show.code}</span>
          {ubicacion && <span className="cty">· {ubicacion}</span>}
        </div>
      </div>

      <div className="track">
        {SEGMENTOS_TRACK.map((rotulo, i) => (
          <span
            key={rotulo}
            className={`seg s-${track[i]}`}
            title={`${rotulo}: ${ROTULO_ESTADO[track[i]]}`}
          >
            <svg viewBox="0 0 24 24">{ICONO[track[i]]}</svg>
            <span className="lab">{rotulo}</span>
          </span>
        ))}
      </div>

      <div className="ramt">
        {show.fee > 0 && (
          <>
            <div className="v">{formatCurrency(show.fee)}</div>
            <span className={`s ${TONO_PAGO[show.paymentStatus]}`}>{show.paymentStatus}</span>
          </>
        )}
      </div>

      <span className="rchev">
        <svg viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}
