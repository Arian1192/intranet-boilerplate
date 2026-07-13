import type { Theme } from '@blocknote/mantine';

// Tema claro calcado al canvas del live (fondo blanco, texto slate, radios suaves).
// Los detalles finos se ajustan con overrides CSS acotados al canvas.
export const docBlockNoteTheme: Theme = {
  colors: {
    editor: { text: '#334155', background: '#ffffff' }, // slate-700 / white
    menu: { text: '#334155', background: '#ffffff' },
    tooltip: { text: '#334155', background: '#f8fafc' },
    hovered: { text: '#334155', background: '#f1f5f9' },
    selected: { text: '#ffffff', background: '#7c3aed' }, // brand violeta
    disabled: { text: '#94a3b8', background: '#f8fafc' },
    shadow: '#e2e8f0',
    border: '#e2e8f0',
    sideMenu: '#cbd5e1',
    highlights: {} as NonNullable<Theme['colors']>['highlights'],
  },
  borderRadius: 8,
  fontFamily: 'Inter, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
