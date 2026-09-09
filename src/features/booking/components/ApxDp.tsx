import { useEffect, useRef, useState } from 'react';

/**
 * El selector de fecha `dp` de la carcasa `apx`, calcado del live el 2026-09-09
 * a las 11:56 CEST (`docs/references/conceptone-v3-2026-09-09/f2d-management--campanas-calendario.{txt,png}`).
 *
 * Lo usan los campos de fecha de los tres modales de Management: `Inicio` y
 * `Fin` en `Editar campaña`, `Fecha` en `Editar activación`, y `Brief enviado` y
 * `Entrega prevista` en `Editar proyecto`.
 *
 * Todo lo que pinta está medido, no supuesto:
 *
 * - La cabecera dice `septiembre 2026`, **sin el «de»** que pondría `Intl` con
 *   `month:'long', year:'numeric'`. El `capitalize` que la sube a «Septiembre
 *   2026» es de `apx.css` (`.dp-head b`), no del texto.
 * - La semana **empieza en lunes** y el miércoles es `X`: `L M X J V S D`.
 * - El hueco de los días previos al 1 es un `<span class="dp-day mut">` vacío,
 *   no un botón; `apx.css` lo esconde con `visibility: hidden`.
 * - El día elegido lleva `sel`, y el pie es `Borrar fecha`.
 *
 * Igual que con `ApxDd`, el live pinta el `.dp-pop` en un portal colgado del
 * `div.apx`; aquí va dentro del propio `.dp`, que es lo que `apx.css` supone
 * (`position: absolute; top: calc(100% + 6px)`). Se ve igual.
 *
 * No entra en el barrel `components/index.ts`: se importa por ruta directa.
 */
export interface ApxDpProps {
  /** ISO (`2026-09-17`), o `null` si el campo está vacío. */
  valor: string | null;
  onCambio: (valor: string | null) => void;
}

const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MES = new Intl.DateTimeFormat('es-ES', { month: 'long', timeZone: 'UTC' });

/** `2026-09-17` → `17/09/2026`, que es como lo escribe el botón del live. */
function aLiteral(iso: string) {
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
}

export function ApxDp({ valor, onCambio }: ApxDpProps) {
  const [abierto, setAbierto] = useState(false);
  const [mesVisible, setMesVisible] = useState(() => (valor ?? new Date().toISOString()).slice(0, 7));
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', escape);
    };
  }, [abierto]);

  const [anio, mes] = mesVisible.split('-').map(Number);
  const primero = new Date(Date.UTC(anio, mes - 1, 1));
  // El live empieza la semana en lunes: el domingo (0) pasa a ser el hueco 6.
  const huecos = (primero.getUTCDay() + 6) % 7;
  const diasDelMes = new Date(Date.UTC(anio, mes, 0)).getUTCDate();

  const saltarMes = (salto: 1 | -1) => {
    const d = new Date(Date.UTC(anio, mes - 1 + salto, 1));
    setMesVisible(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`);
  };

  const elegir = (dia: number) => {
    onCambio(`${mesVisible}-${String(dia).padStart(2, '0')}`);
    setAbierto(false);
  };

  return (
    <div ref={caja} className={`dp ${abierto ? 'open' : ''}`}>
      <button type="button" className="dp-btn" onClick={() => setAbierto((previo) => !previo)}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v3M16 3v3" />
        </svg>
        <span className={`dp-lab ${valor ? '' : 'ph'}`}>
          {valor ? aLiteral(valor) : 'dd/mm/aaaa'}
        </span>
      </button>
      {abierto && (
        <div className="dp-pop">
          <div className="dp-head">
            <button
              type="button"
              className="dp-nav"
              aria-label="Mes anterior"
              onClick={() => saltarMes(-1)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            {/* El live escribe «septiembre 2026», sin el «de». */}
            <b>{`${MES.format(primero)} ${anio}`}</b>
            <button
              type="button"
              className="dp-nav"
              aria-label="Mes siguiente"
              onClick={() => saltarMes(1)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <div className="dp-dow">
            {DIAS_SEMANA.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="dp-grid">
            {Array.from({ length: huecos }, (_, i) => (
              <span key={`hueco-${i}`} className="dp-day mut" />
            ))}
            {Array.from({ length: diasDelMes }, (_, i) => {
              const dia = i + 1;
              const iso = `${mesVisible}-${String(dia).padStart(2, '0')}`;
              return (
                <button
                  key={dia}
                  type="button"
                  className={`dp-day ${iso === valor ? 'sel' : ''}`}
                  onClick={() => elegir(dia)}
                >
                  {dia}
                </button>
              );
            })}
          </div>
          <button type="button" className="dp-clear" onClick={() => (onCambio(null), setAbierto(false))}>
            Borrar fecha
          </button>
        </div>
      )}
    </div>
  );
}
