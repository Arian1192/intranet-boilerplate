import { useState } from 'react';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { TypographySlider } from '../components/TypographySlider';
import { FACTORY_DEFAULTS, type TypographySettings } from '../data/documentos';

export function DocumentosTipografiaPage() {
  const [settings, setSettings] = useState<TypographySettings>(FACTORY_DEFAULTS);
  const dirty = JSON.stringify(settings) !== JSON.stringify(FACTORY_DEFAULTS);

  const set = <K extends keyof TypographySettings>(key: K) => (value: number) =>
    setSettings((s) => ({ ...s, [key]: value }));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Documentos · tipografía"
        subtitle="Cómo se ve el texto en Mi trabajo. Vale para todo el equipo: si cada uno tuviera la suya, dos personas mirando el mismo documento verían páginas distintas."
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSettings(FACTORY_DEFAULTS)}
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          Volver a los valores de fábrica
        </button>
        <span className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500">
          {dirty ? 'Cambios sin guardar' : 'Guardado'}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white px-4">
          <TypographySlider
            label="Tamaño del texto" value={settings.textSize} unit="px" min={10} max={24} step={1}
            help="16 px es el tamaño normal de lectura: lo que usan Notion y Word (12 pt). Por debajo de 15, la gente acerca la cara a la pantalla."
            onChange={set('textSize')}
          />
          <TypographySlider
            label="Interlineado" value={settings.lineHeight} unit="" min={1} max={2} step={0.05}
            help="Espacio entre las líneas de un mismo párrafo. Notion usa 1,45. Por debajo de 1,35 el texto se apelmaza y cuesta seguir el renglón."
            onChange={set('lineHeight')}
          />
          <TypographySlider
            label="Aire entre párrafos" value={settings.paragraphGap} unit="px" min={0} max={16} step={1}
            help="Separación ENTRE párrafos. Si el texto te parece aireado y el interlineado ya está bajo, el culpable suele ser este."
            onChange={set('paragraphGap')}
          />
          <TypographySlider
            label="Título 1" value={settings.h1Scale} unit="x" min={1} max={3} step={0.05}
            help="Multiplica el tamaño del texto. BlockNote trae 3x de serie, que es enorme."
            onChange={set('h1Scale')}
          />
          <TypographySlider label="Título 2" value={settings.h2Scale} unit="x" min={1} max={3} step={0.05} onChange={set('h2Scale')} />
          <TypographySlider label="Título 3" value={settings.h3Scale} unit="x" min={1} max={3} step={0.05} onChange={set('h3Scale')} />
          <TypographySlider
            label="Interlineado de los títulos" value={settings.headingLineHeight} unit="" min={1} max={2} step={0.05}
            help="Apretado a propósito: un título de dos líneas con el interlineado del cuerpo abre un desierto en medio de la página."
            onChange={set('headingLineHeight')}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Así se verá</p>
          <div
            className="rounded-xl border border-slate-100 bg-white p-5"
            style={{ fontSize: `${settings.textSize}px`, lineHeight: settings.lineHeight }}
          >
            <h1
              style={{ fontSize: `${settings.textSize * settings.h1Scale}px`, lineHeight: settings.headingLineHeight, marginBottom: settings.paragraphGap }}
              className="font-bold text-slate-800"
            >
              Rider de Charlotte de Witte
            </h1>
            <p style={{ marginBottom: settings.paragraphGap }} className="text-slate-600">
              El promotor confirma la fecha antes del 12 de septiembre. Si no hay confirmación por escrito, la reserva
              decae y la fecha vuelve a estar disponible para otros territorios. Esto no es una formalidad: el año
              pasado perdimos dos fines de semana esperando un correo que nunca llegó.
            </p>
            <h2
              style={{ fontSize: `${settings.textSize * settings.h2Scale}px`, lineHeight: settings.headingLineHeight, marginBottom: settings.paragraphGap }}
              className="font-bold text-slate-800"
            >
              Técnico
            </h2>
            <p style={{ marginBottom: settings.paragraphGap }} className="text-slate-600">
              Cabina con dos CDJ-3000 y un DJM-A9. Monitores a la altura de la cabina, nunca en el suelo.
            </p>
            <ul className="list-disc pl-5 text-slate-600" style={{ marginBottom: settings.paragraphGap }}>
              <li>Soundcheck 90 minutos antes de la apertura de puertas</li>
              <li>Hospitality en camerino privado</li>
              <li>Toalla, agua sin gas, fruta</li>
            </ul>
            <h3
              style={{ fontSize: `${settings.textSize * settings.h3Scale}px`, lineHeight: settings.headingLineHeight, marginBottom: settings.paragraphGap }}
              className="font-bold text-slate-800"
            >
              Nota
            </h3>
            <p className="text-slate-600">Cualquier cambio en el horario se comunica al management, no al artista.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
