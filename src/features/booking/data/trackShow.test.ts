import { describe, it, expect } from 'vitest';
import { SEGMENTOS_TRACK, bordeDeTrack, trackDeFase } from './trackShow';

describe('trackShow — la derivación declarada del track', () => {
  it('los seis segmentos van en el orden del live', () => {
    expect(SEGMENTOS_TRACK).toEqual([
      'Confirm.',
      'Contrato',
      'Cobro',
      'Itiner.',
      'Gastos',
      'Liquid.',
    ]);
  });

  /*
   * Los dos anclajes. No son elecciones: son las dos únicas fases cuyo patrón
   * es CONSTANTE en las 87 filas del live —`Sin gestión` en 9 de 9 y `Cerrado`
   * en 1 de 1—. La derivación interpola entre puntos conocidos, así que estos
   * dos tiene que clavarlos. Si alguien cambia la tabla y los rompe, ha dejado
   * de respetar una medida y esto se pone rojo.
   */
  it('ANCLAJE · «Sin gestión» deja los seis en `none`, como en las 9 filas del live', () => {
    expect(trackDeFase('sin-gestion')).toEqual(['none', 'none', 'none', 'none', 'none', 'none']);
  });

  it('ANCLAJE · «Cerrado» deja los seis en `done`, como en la fila del live', () => {
    expect(trackDeFase('liquidado')).toEqual(['done', 'done', 'done', 'done', 'done', 'done']);
  });

  it('cada fase devuelve exactamente seis estados', () => {
    for (const fase of [
      'tentative',
      'confirmed',
      'contract',
      'pagos',
      'liquidacion',
      'liquidado',
      'cancelado',
    ] as const) {
      expect(trackDeFase(fase)).toHaveLength(6);
    }
  });

  it('el borde de la fila sale del propio track, como en el live', () => {
    // 68 de las 87 filas del live van en `h-alert`, y todas tienen un segmento
    // en `alert`: es el «requisito bloqueante sin resolver» de la leyenda.
    expect(bordeDeTrack(trackDeFase('contract'))).toBe('h-alert');
    expect(bordeDeTrack(trackDeFase('liquidado'))).toBe('h-ok');
    expect(bordeDeTrack(trackDeFase('cancelado'))).toBe('h-prog');
    expect(bordeDeTrack(trackDeFase('sin-gestion'))).toBe('srow-mut');
  });
});
