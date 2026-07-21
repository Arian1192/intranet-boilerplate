import { describe, it, expect } from 'vitest';
import { MODULES } from './constants';
import { MODULE_ICONS } from './icons';

describe('MODULES (fuente canónica)', () => {
  it('tiene los 12 módulos del live con sus acentos exactos', () => {
    expect(MODULES).toHaveLength(12);
    const bySlug = Object.fromEntries(MODULES.map((m) => [m.slug, m]));
    expect(bySlug.conceptone.accent).toBe('#773C9F');
    expect(bySlug.mixmag.accent).toBe('#E11D48');
    expect(bySlug.tagmag.accent).toBe('#0EA5E9');
    expect(bySlug.crm.accent).toBe('#0D9488');
    expect(bySlug.personal.accent).toBe('#0F172A');
    expect(bySlug.herramientas.accent).toBe('#16834D');
    expect(bySlug.configuracion.accent).toBe('#475569');
  });

  it('agrupa en workspace/management/tools', () => {
    const by = (c: string) => MODULES.filter((m) => m.category === c).map((m) => m.slug);
    expect(by('workspace')).toEqual([
      'conceptone', 'etra', 'produccion', 'euphoric', 'mixmag', 'tagmag', 'creativos', 'cruda',
    ]);
    expect(by('management')).toEqual(['crm', 'personal']);
    expect(by('tools')).toEqual(['herramientas', 'configuracion']);
  });

  it('cada módulo tiene un icono registrado', () => {
    for (const m of MODULES) expect(MODULE_ICONS[m.id]).toBeTruthy();
  });
});
