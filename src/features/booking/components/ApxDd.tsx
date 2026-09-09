import { useEffect, useRef, useState } from 'react';

/**
 * El desplegable `dd` de la carcasa `apx`, calcado del live el 2026-09-09
 * (`docs/references/conceptone-v3-2026-09-09/f2b-management--*-filtros.txt`).
 *
 * Lo usan los filtros de `/management/{activaciones,campanas,content}`. No entra
 * en el barrel `components/index.ts` a propósito: la regla anti-conflicto de la
 * ronda pide importar por ruta directa y no tocar los `index.ts` compartidos.
 *
 * Las clases (`dd`, `dd-btn`, `dd-lab`, `chev`, `dd-menu`, `dd-opt`, `sel`) ya
 * están definidas en `apx.css` y se escriben tal cual: el violeta del estado
 * abierto y de la opción elegida lo pone la carcasa.
 *
 * **Una diferencia deliberada con el live:** allí el menú se pinta en un portal
 * colgado del `div.apx` y se le calcula la posición con estilos en línea. Aquí
 * va dentro del propio `.dd`, que es justo lo que `apx.css` supone
 * (`.apx .dd-menu { position: absolute; top: calc(100% + 6px); left: 0; right: 0 }`).
 * El resultado pintado es el mismo y evita reimplementar un portal.
 */
export interface ApxDdProps {
  /** Rótulo del «todas», que es a la vez la primera opción y el valor por defecto. */
  todas: string;
  opciones: readonly string[];
  /** `null` = sin filtrar, y entonces el botón rotula `todas`. */
  valor: string | null;
  onCambio: (valor: string | null) => void;
  /** Ancho que le da el live a este filtro concreto (`w-48`, `w-52`…). */
  ancho: string;
}

export function ApxDd({ todas, opciones, valor, onCambio, ancho }: ApxDdProps) {
  const [abierto, setAbierto] = useState(false);
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

  const elegir = (opcion: string | null) => {
    onCambio(opcion);
    setAbierto(false);
  };

  return (
    <div ref={caja} className={`dd ${abierto ? 'open ' : ''}${ancho}`}>
      <button
        type="button"
        className="dd-btn"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => setAbierto((previo) => !previo)}
      >
        <span className="dd-lab">{valor ?? todas}</span>
        <svg
          className="chev"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {abierto && (
        <div className="dd-menu" role="listbox">
          {[null, ...opciones].map((opcion) => (
            <div
              key={opcion ?? '__todas__'}
              role="option"
              aria-selected={opcion === valor}
              className={`dd-opt${opcion === valor ? ' sel' : ''}`}
              onClick={() => elegir(opcion)}
            >
              {/* El live pinta este hueco de 0 px; el `gap` del `.dd-opt` lo
                  convierte en la sangría de la opción. */}
              <span style={{ width: '0px' }} />
              <span className="dd-lab">{opcion ?? todas}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
