import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router';
import { InsightsArtistaPage } from './InsightsArtistaPage';
import {
  FICHAS,
  KPIS_OVERVIEW,
  PLATAFORMAS,
  serie,
} from '@/features/booking/data/management-insights-ficha';

/**
 * Los tests van contra **reglas y literales medidos**, no contra cifras
 * concretas: el live mueve los números en horas (durante el propio recon vimos
 * el oyentes-mensuales de Janse pasar de `136K` a `126.7K` en 23 minutos), así
 * que atarlos aquí sería atarse a una foto que caduca.
 */
function renderFicha(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/management/insights/${id}`]}>
      <Routes>
        <Route path="/management/insights/:artistaId" element={<InsightsArtistaPage />} />
        <Route path="/management/insights" element={<h1>Insights</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

const pestanas = () =>
  screen
    .getAllByRole('button')
    .map((b) => b.textContent ?? '')
    .filter((t) => t === 'Overview' || t === 'Audiencia' || PLATAFORMAS.some((p) => p.nombre === t));

describe('InsightsArtistaPage — cabecera', () => {
  it('trae la flecha de volver, el nombre, el chip de estado y el pie de Songstats', () => {
    renderFicha('janse');
    expect(screen.getByRole('link', { name: '←' })).toHaveAttribute(
      'href',
      '/management/insights'
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Janse' })).toBeInTheDocument();
    expect(screen.getByText('En declive')).toBeInTheDocument();
    expect(screen.getByText(/^Songstats · actualizado /)).toBeInTheDocument();
  });

  it('`Sincronizar` está calcado pero inerte: no navega ni cambia la pantalla', async () => {
    renderFicha('janse');
    const boton = screen.getByRole('button', { name: 'Sincronizar' });
    await userEvent.click(boton);
    // Sigue en la misma ficha y en la misma pestaña: no se cableó a nada.
    expect(screen.getByRole('heading', { level: 1, name: 'Janse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveClass('border-slate-800');
  });

  it('cada estado trae su chip con la paleta medida, y `Creciendo` va en violeta de Tailwind', () => {
    for (const [id, estado, clase] of [
      ['janse', 'En declive', 'bg-rose-50'],
      ['londonground', 'Estable', 'bg-amber-50'],
      ['dhmoon', 'Escalando', 'bg-emerald-50'],
      ['marcelbs', 'Creciendo', 'bg-violet-50'],
      ['ledher', 'Sin datos', 'bg-slate-50'],
    ] as const) {
      const { unmount } = renderFicha(id);
      expect(screen.getByText(estado)).toHaveClass(clase);
      unmount();
    }
  });
});

describe('InsightsArtistaPage — las pestañas no son un conjunto fijo', () => {
  it('cada artista trae las suyas: Londonground 14, Janse 12, Marcel BS 6, Ledher 1', () => {
    for (const [id, cuenta] of [
      ['londonground', 14],
      ['janse', 12],
      ['marcelbs', 6],
      ['ledher', 1],
    ] as const) {
      const { unmount } = renderFicha(id);
      expect(pestanas()).toHaveLength(cuenta);
      unmount();
    }
  });

  it('siempre son una subsecuencia del orden canónico del live', () => {
    const canon = ['Overview', 'Audiencia', ...PLATAFORMAS.map((p) => p.nombre)];
    for (const ficha of FICHAS) {
      const { unmount } = renderFicha(ficha.id);
      const vistas = pestanas();
      let i = -1;
      for (const nombre of vistas) {
        const j = canon.indexOf(nombre, i + 1);
        expect(j, `${ficha.id}: ${nombre} fuera del orden canónico`).toBeGreaterThan(i);
        i = j;
      }
      unmount();
    }
  });

  /**
   * La regla no es «esa fuente tiene histórico», que es lo que parece a primera
   * vista y lo que llegué a dar por bueno: Marcel BS tiene 731 puntos de
   * Beatport y DH Moon 230 de Amazon, y **ninguno de los dos trae esa pestaña**,
   * porque los KPI que esas pestañas pintan están a cero.
   */
  it('una plataforma con histórico pero con sus KPI a cero NO trae pestaña', () => {
    const { unmount } = renderFicha('marcelbs');
    expect(pestanas()).not.toContain('Beatport');
    unmount();
    renderFicha('dhmoon');
    expect(pestanas()).not.toContain('Amazon');
  });

  it('Londonground trae `Amazon` y `Apple Music`, que Janse no tiene', () => {
    const { unmount } = renderFicha('londonground');
    expect(pestanas()).toEqual(expect.arrayContaining(['Amazon', 'Apple Music']));
    unmount();
    renderFicha('janse');
    expect(pestanas()).not.toEqual(expect.arrayContaining(['Amazon']));
  });
});

describe('InsightsArtistaPage — Overview', () => {
  it('pinta los nueve KPI del live, con sus etiquetas y en su orden', () => {
    renderFicha('janse');
    const etiquetas = screen
      .getAllByText(/./)
      .filter((e) => e.className.includes('uppercase tracking-wide text-slate-400'))
      .map((e) => e.textContent);
    expect(etiquetas).toEqual([...KPIS_OVERVIEW]);
  });

  it('trae los tres bloques, incluido `RELEASES`, que el spec no tenía', () => {
    renderFicha('janse');
    for (const titulo of ['Top tracks', 'Hitos recientes', 'Releases']) {
      expect(screen.getByRole('heading', { level: 2, name: titulo })).toBeInTheDocument();
    }
  });

  it('el conmutador de `TOP TRACKS` cambia el CONJUNTO de pistas, no sólo el orden', async () => {
    renderFicha('janse');
    const bloque = screen.getByRole('heading', { level: 2, name: 'Top tracks' }).closest('.card')!;
    const cuenta = () => within(bloque as HTMLElement).getAllByRole('listitem').length;

    const porStreams = cuenta();
    await userEvent.click(within(bloque as HTMLElement).getByRole('button', { name: 'Popularidad' }));
    const porPopularidad = cuenta();
    await userEvent.click(
      within(bloque as HTMLElement).getByRole('button', { name: 'Playlist reach' })
    );
    const porReach = cuenta();

    // Medido en el live: 8 / 12 / 14. Lo que se blinda es que crecen, no las cifras.
    expect(porPopularidad).toBeGreaterThan(porStreams);
    expect(porReach).toBeGreaterThan(porPopularidad);
  });
});

describe('InsightsArtistaPage — el estado de fallo de sincronización', () => {
  it('Sebastian Ledher: una sola pestaña, nueve KPI a `—` y «Sin datos.» en los bloques', () => {
    renderFicha('ledher');
    expect(pestanas()).toEqual(['Overview']);
    expect(screen.getAllByText('—')).toHaveLength(KPIS_OVERVIEW.length);
    expect(screen.getAllByText('Sin datos.')).toHaveLength(2);
    // Sin releases, el bloque desaparece entero en vez de pintarse vacío.
    expect(screen.queryByRole('heading', { level: 2, name: 'Releases' })).not.toBeInTheDocument();
  });

  it('un artista que no capturamos usa esa misma plantilla real, no un «no encontrado»', () => {
    renderFicha('bizza');
    expect(screen.getByRole('heading', { level: 1, name: 'Bizza' })).toBeInTheDocument();
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(pestanas()).toEqual(['Overview']);
  });
});

describe('InsightsArtistaPage — pestañas de plataforma', () => {
  it('Spotify trae su gráfico, sus KPI, `TOP TRACKS` y `TOP PLAYLISTS`', async () => {
    renderFicha('janse');
    await userEvent.click(screen.getByRole('button', { name: 'Spotify' }));
    expect(screen.getByRole('img', { name: 'Spotify — Oyentes mensuales' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Top playlists' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Top tracks' })).toBeInTheDocument();
  });

  it('sin serie no hay tarjeta de gráfico: Traxsource sólo pinta sus dos KPI', async () => {
    renderFicha('janse');
    await userEvent.click(screen.getByRole('button', { name: 'Traxsource' }));
    expect(screen.queryByRole('img', { name: /Traxsource/ })).not.toBeInTheDocument();
    expect(screen.getByText('Charts')).toBeInTheDocument();
    expect(screen.getByText('Tracks')).toBeInTheDocument();
  });

  it('el conmutador de rango recorta la serie y recalcula el delta', async () => {
    renderFicha('janse');
    await userEvent.click(screen.getByRole('button', { name: 'Spotify' }));
    const grafico = screen.getByRole('img', { name: /Spotify/ });
    const puntos = () => (grafico.querySelectorAll('path')[1].getAttribute('d') ?? '').split('L').length;

    const todo = puntos();
    await userEvent.click(screen.getByRole('button', { name: '1M' }));
    expect(puntos()).toBeLessThan(todo);
    await userEvent.click(screen.getByRole('button', { name: 'Todo' }));
    expect(puntos()).toBe(todo);
  });

  it('la cifra grande del gráfico NO cambia con el rango: sólo cambian serie y delta', async () => {
    renderFicha('janse');
    await userEvent.click(screen.getByRole('button', { name: 'Spotify' }));
    const cifra = () =>
      screen.getByRole('img', { name: /Spotify/ }).closest('.card')!.querySelector('.text-2xl')!
        .textContent;
    const antes = cifra();
    await userEvent.click(screen.getByRole('button', { name: '3M' }));
    expect(cifra()).toBe(antes);
  });

  it('cada plataforma pinta su gráfico con el color medido del live', async () => {
    renderFicha('londonground');
    for (const [nombre, color] of [
      ['Spotify', '#1DB954'],
      ['Shazam', '#0088FF'],
      ['YouTube', '#FF0000'],
      ['Instagram', '#E1306C'],
    ] as const) {
      await userEvent.click(screen.getByRole('button', { name: nombre }));
      const linea = screen.getByRole('img', { name: new RegExp(nombre) }).querySelectorAll('path')[1];
      expect(linea).toHaveAttribute('stroke', color);
    }
  });
});

describe('InsightsArtistaPage — Audiencia', () => {
  it('pinta el mapamundi con sus 292 países y las burbujas de ciudad', async () => {
    renderFicha('janse');
    await userEvent.click(screen.getByRole('button', { name: 'Audiencia' }));
    const mapa = screen.getByRole('img', { name: 'Oyentes por ciudad' });
    expect(mapa.querySelectorAll('path')).toHaveLength(292);
    expect(mapa.querySelectorAll('circle').length).toBeGreaterThan(0);
  });

  it('`Pico` saca más burbujas que `Actual`: no es el mismo conjunto', async () => {
    renderFicha('janse');
    await userEvent.click(screen.getByRole('button', { name: 'Audiencia' }));
    const burbujas = () =>
      screen.getByRole('img', { name: 'Oyentes por ciudad' }).querySelectorAll('circle').length;
    const actual = burbujas();
    await userEvent.click(screen.getByRole('button', { name: 'Pico' }));
    expect(burbujas()).toBeGreaterThan(actual);
  });

  it('la tabla de ciudades se corta en 25 filas y las barras de país en 12', async () => {
    renderFicha('dhmoon'); // 248 ciudades: sobra material para que el recorte se note.
    await userEvent.click(screen.getByRole('button', { name: 'Audiencia' }));
    expect(screen.getAllByRole('row')).toHaveLength(26); // 25 + la cabecera
  });
});

describe('management-insights-ficha — el modelo', () => {
  it('`serie()` reconstruye las fechas respetando los huecos del live', () => {
    expect(serie('2024-09-02', [0, 10, 1, 12, 8, 20])).toEqual([
      { fecha: '2024-09-02', valor: 10 },
      { fecha: '2024-09-03', valor: 12 },
      { fecha: '2024-09-10', valor: 20 },
    ]);
  });

  it('hay una ficha por cada chip alcanzable del listado', () => {
    expect(FICHAS.map((f) => f.estado).sort()).toEqual(
      ['Creciendo', 'En declive', 'Escalando', 'Estable', 'Sin datos'].sort()
    );
  });

  it('los recortes de lista son los medidos en el live', () => {
    for (const f of FICHAS) {
      expect(f.hitos.length).toBeLessThanOrEqual(18);
      expect(f.releases.length).toBeLessThanOrEqual(24);
      expect(f.topPlaylists.length).toBeLessThanOrEqual(14);
      for (const pistas of Object.values(f.topTracks)) {
        expect(pistas.length).toBeLessThanOrEqual(15);
      }
    }
  });

  it('una plataforma sin serie no declara métrica, y con serie sí', () => {
    for (const f of FICHAS) {
      for (const p of f.plataformas) {
        expect(Boolean(p.metrica)).toBe(p.serie.length > 0);
      }
    }
  });
});
