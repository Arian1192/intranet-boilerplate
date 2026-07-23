import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { templates, FOOTER_NOTE } from './plantillasCorreo';

describe('plantillasCorreo data', () => {
  it('siembra las 6 plantillas en el orden del live', () => {
    const list = templates();
    expect(list.map((t) => t.slug)).toEqual([
      'invitacion_portal',
      'invitacion_usuario',
      'liquidacion_show',
      'reset_password',
      'vacaciones_aprobada',
      'vacaciones_rechazada',
    ]);
  });

  it('solo las 3 de autenticación tienen botón/enlace', () => {
    const list = templates();
    const conBoton = list.filter((t) => t.buttonLabel !== '');
    expect(conBoton.map((t) => t.slug).sort()).toEqual(['invitacion_portal', 'invitacion_usuario', 'reset_password'].sort());
    const sinBoton = list.filter((t) => t.buttonLabel === '');
    expect(sinBoton).toHaveLength(3);
    sinBoton.forEach((t) => expect(t.buttonLink).toBe(''));
  });

  it('liquidacion_show tiene 10 variables incluida gastos_detalle', () => {
    const t = templates().find((x) => x.slug === 'liquidacion_show')!;
    expect(t.variables).toHaveLength(10);
    expect(t.variables).toContain('{{gastos_detalle}}');
    expect(t.subject).toBe('Liquidación {{artista}}, {{show}} - {{fecha}}');
  });

  it('asuntos y títulos exactos de invitacion_portal', () => {
    const t = templates().find((x) => x.slug === 'invitacion_portal')!;
    expect(t.subject).toBe('Acceso a tu portal de cliente · CRUDA by Black Moose Group');
    expect(t.emailTitle).toBe('Acceso a tu portal de cliente');
    expect(t.buttonLabel).toBe('Crear mi contraseña');
    expect(t.buttonLink).toBe('{{link}}');
  });

  it('FOOTER_NOTE literal del live', () => {
    expect(FOOTER_NOTE).toMatch(/no-reply@blackmoose\.es/);
  });

  it('es inmutable: mutar el array devuelto no afecta a la siguiente llamada', () => {
    const a = templates();
    a[0].variables.push('{{x}}');
    a.pop();
    const b = templates();
    expect(b).toHaveLength(6);
    expect(b[0].variables).not.toContain('{{x}}');
  });
});
