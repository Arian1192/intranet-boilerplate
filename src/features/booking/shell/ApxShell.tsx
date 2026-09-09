import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { HelpPanel } from '@/components/layout';
import './apx.css';

export type ApxTema = 'light' | 'dark';

/** Clave de persistencia del tema, verificada en el live. */
export const CLAVE_TEMA = 'apx-tema';

interface ApxShellValue {
  tema: ApxTema;
  alternarTema: () => void;
  abrirAyuda: () => void;
}

const ApxShellContext = createContext<ApxShellValue | null>(null);

function leerTemaGuardado(): ApxTema {
  try {
    return window.localStorage.getItem(CLAVE_TEMA) === 'dark' ? 'dark' : 'light';
  } catch {
    // Modo privado o storage bloqueado: el claro es el estado por defecto.
    return 'light';
  }
}

function guardarTema(tema: ApxTema) {
  try {
    window.localStorage.setItem(CLAVE_TEMA, tema);
  } catch {
    // Sin persistencia el tema sigue funcionando dentro de la sesión.
  }
}

/**
 * Envoltorio de ConceptOne: aporta la clase `.apx` con sus propios tokens y el
 * estado del tema.
 *
 * En claro el atributo `data-theme` **no se pone**. El live no usa
 * `data-theme="light"`: el tema claro es la ausencia del atributo, y las reglas
 * oscuras cuelgan de `.apx[data-theme="dark"]`.
 *
 * Sólo se escribe en `localStorage` al alternar, no al montar, para no fijar la
 * clave a nadie que no haya tocado el botón.
 */
export function ApxShell({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<ApxTema>(leerTemaGuardado);
  // La ayuda ya existente se reabre remontándola: `HelpPanel` gobierna su propio
  // estado y nace abierto, así que un `key` nuevo equivale a «ábrete».
  const [ayudaKey, setAyudaKey] = useState(0);

  const value = useMemo<ApxShellValue>(
    () => ({
      tema,
      alternarTema: () =>
        setTema((previo) => {
          const siguiente: ApxTema = previo === 'dark' ? 'light' : 'dark';
          guardarTema(siguiente);
          return siguiente;
        }),
      abrirAyuda: () => setAyudaKey((previo) => previo + 1),
    }),
    [tema]
  );

  return (
    <ApxShellContext.Provider value={value}>
      <div className="apx min-h-screen" data-theme={tema === 'dark' ? 'dark' : undefined}>
        {children}
        <HelpPanel key={ayudaKey} />
      </div>
    </ApxShellContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Context + hook colocados, como en `proyecciones-context`.
export function useApxShell(): ApxShellValue {
  const ctx = useContext(ApxShellContext);
  if (!ctx) throw new Error('useApxShell debe usarse dentro de <ApxShell>');
  return ctx;
}
