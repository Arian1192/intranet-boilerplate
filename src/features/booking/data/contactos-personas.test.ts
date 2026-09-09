import { describe, it, expect } from 'vitest';
import { personasContacto, filtrarPersonas } from './contactos-personas';

describe('personas de /contactos', () => {
  it('son las 109 del live, en su orden', () => {
    expect(personasContacto).toHaveLength(109);
    expect(personasContacto[0].nombre).toBe('Aaron Martin');
  });

  it('dos fichas del live traen el dato sucio, y se calcan tal cual', () => {
    const sinEmail = personasContacto.filter((p) => !p.email.includes('@'));
    expect(sinEmail).toHaveLength(2);
    // En las dos, el email dice «Sin contacto» y el correo se coló en el nombre.
    for (const persona of sinEmail) {
      expect(persona.email).toBe('Sin contacto');
      expect(persona.nombre).toContain('@');
    }
    expect(sinEmail[0].nombre).toBe('calmagroupmarbella@gmail.com');
    // Las otras 107 sí tienen un email de verdad.
    expect(personasContacto.filter((p) => p.email.includes('@'))).toHaveLength(107);
  });

  it('el rol casi siempre es Signer, y cinco no tienen ninguno', () => {
    const roles = personasContacto.reduce<Record<string, number>>((cuenta, p) => {
      const clave = p.rol ?? '(sin rol)';
      cuenta[clave] = (cuenta[clave] ?? 0) + 1;
      return cuenta;
    }, {});
    expect(roles).toEqual({ Signer: 101, '(sin rol)': 5, Promotor: 1, Logística: 1, CFO: 1 });
  });

  it('sólo nueve llevan la píldora de organización', () => {
    const conOrg = personasContacto.filter((p) => p.organizacion !== null);
    expect(conOrg).toHaveLength(9);
    expect(conOrg[0]).toMatchObject({
      nombre: 'Diego Monico',
      organizacion: 'Casa De Mar LLC · Signer',
    });
  });
});

describe('filtrarPersonas', () => {
  it('sin texto las devuelve todas', () => {
    expect(filtrarPersonas(personasContacto, '')).toHaveLength(109);
  });

  it('busca por nombre sin distinguir acentos ni mayúsculas', () => {
    // Son dos, y una lleva los acentos y la otra no: la búsqueda las junta.
    expect(filtrarPersonas(personasContacto, 'JOSE ANGEL').map((p) => p.nombre)).toEqual([
      'JOSÉ ÁNGEL MARQUEZ',
      'Jose Angel Marquez Garcia',
    ]);
  });

  it('busca también por email y por organización', () => {
    expect(filtrarPersonas(personasContacto, 'neweracap').map((p) => p.nombre)).toEqual([
      'Jack Merren',
      'Sharyn Brown',
    ]);
    expect(filtrarPersonas(personasContacto, 'casa de mar').map((p) => p.nombre)).toEqual([
      'Diego Monico',
    ]);
  });

  it('devuelve vacío si no hay nadie', () => {
    expect(filtrarPersonas(personasContacto, 'zzzz')).toEqual([]);
  });
});

describe('las personas repetidas del live', () => {
  it('cada ficha tiene id propio, porque hay nombres y emails repetidos', () => {
    const ids = personasContacto.map((p) => p.id);
    expect(new Set(ids).size).toBe(109);

    // Cuatro pares comparten nombre Y email; sin id propio colisionan como
    // clave de React y al filtrar se quedan pintadas filas que ya no tocan.
    const porNombreEmail = personasContacto.reduce<Record<string, number>>((c, p) => {
      const k = `${p.nombre}-${p.email}`;
      c[k] = (c[k] ?? 0) + 1;
      return c;
    }, {});
    expect(Object.values(porNombreEmail).filter((n) => n > 1)).toHaveLength(4);

    // Y uno sale cuatro veces.
    expect(personasContacto.filter((p) => p.nombre === 'Ramón Bordas de Togores')).toHaveLength(4);
  });
});
