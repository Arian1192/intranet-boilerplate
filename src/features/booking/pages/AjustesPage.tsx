import { useId, useState, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  GRUPOS_AJUSTES,
  PANEL_POR_DEFECTO,
  seccionesFiscales,
  ocultarMovimientos,
  contratos,
  AGENTES_COMISION,
  ajustesComision,
  alertas,
  recordatorios,
  confirmacionShow,
  formularioOfertas,
  extrasLogistica,
  calendarioGoogle,
} from '../data/ajustes-conceptone';

/** Campo `label` + `input` de la carcasa, que es el patrón de casi todo el panel. */
function Campo({
  etiqueta,
  valor,
  tipo = 'text',
  placeholder,
  className,
}: {
  etiqueta: string;
  valor?: string;
  tipo?: string;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        {etiqueta}
      </label>
      <input id={id} type={tipo} className="input" defaultValue={valor} placeholder={placeholder} />
    </div>
  );
}

function CampoNumero({
  etiqueta,
  valor,
  ancho = 'w-24',
}: {
  etiqueta: string;
  valor: number;
  ancho?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className="label" htmlFor={id}>
        {etiqueta}
      </label>
      <input id={id} type="number" className={cn('input', ancho)} defaultValue={valor} />
    </div>
  );
}

function Casilla({ etiqueta, marcada }: { etiqueta: string; marcada: boolean }) {
  const id = useId();
  return (
    <label
      className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        defaultChecked={marcada}
        className="h-4 w-4 rounded border-slate-300 text-brand-600"
      />
      <span className="text-slate-600">{etiqueta}</span>
    </label>
  );
}

function TituloSeccion({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </div>
  );
}

/** Panel 1. El único con la barra pegajosa de guardado. */
function PanelDatosFiscales() {
  return (
    <form className="space-y-4">
      <div className="sticky top-16 z-20 -mx-5 -mt-5 mb-1 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-5 py-2.5 backdrop-blur">
        <span className="min-w-0 text-sm font-medium text-slate-700">
          <span className="truncate">ConceptOne</span>
          <span className="ml-2 whitespace-nowrap text-xs font-normal text-slate-400">
            Guardado
          </span>
        </span>
        <button type="submit" disabled className="btn-primary shrink-0 text-sm">
          Guardar
        </button>
      </div>
      {seccionesFiscales.map((seccion, i) => (
        <div key={seccion.titulo} className={cn(i > 0 && 'border-t border-slate-100 pt-4')}>
          <TituloSeccion>{seccion.titulo}</TituloSeccion>
          {seccion.buscador && (
            <div className="mb-3">
              <Campo
                etiqueta={seccion.buscador.etiqueta}
                placeholder={seccion.buscador.placeholder}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {seccion.campos.map((campo) => (
              <Campo
                key={campo.etiqueta}
                etiqueta={campo.etiqueta}
                valor={campo.valor}
                tipo={campo.tipo ?? 'text'}
                className={campo.ancho === 'completo' ? 'col-span-2' : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </form>
  );
}

/** Panel 2. */
function PanelOcultarMovimientos() {
  const id = useId();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{ocultarMovimientos.titulo}</h2>
        <p className="mt-1 text-sm text-slate-500">{ocultarMovimientos.descripcion}</p>
      </div>
      <div>
        <label className="label" htmlFor={id}>
          {ocultarMovimientos.etiqueta}
        </label>
        <textarea
          id={id}
          className="input min-h-[90px]"
          placeholder={ocultarMovimientos.placeholder}
          defaultValue={ocultarMovimientos.valor}
        />
        <p className="mt-1 text-xs text-slate-400">{ocultarMovimientos.nota}</p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {ocultarMovimientos.chips.map((chip) => (
          <li key={chip} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
            {chip}
          </li>
        ))}
      </ul>
      <button type="button" className="btn-primary text-sm">
        Guardar
      </button>
    </div>
  );
}

/** Panel 3. Trae su propia cabecera: en el live es una página entera embebida. */
function PanelContratos() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{contratos.titulo}</h1>
          <p className="text-sm text-slate-500">{contratos.descripcion}</p>
        </div>
        <button type="button" className="btn-primary">
          + Nueva plantilla
        </button>
      </div>
      {contratos.plegables.map((plegable) => (
        <section key={plegable.titulo} className="card mb-6 overflow-hidden">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-slate-50"
          >
            <div>
              <h2 className="text-sm font-semibold text-slate-800">{plegable.titulo}</h2>
              <p className="text-xs text-slate-400">{plegable.texto}</p>
            </div>
            <span className="text-slate-400">▸</span>
          </button>
        </section>
      ))}
      <div className="card divide-y divide-slate-100">
        {contratos.plantillas.map((plantilla) => (
          <div key={plantilla.titulo} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">{plantilla.titulo}</span>
                <span className="badge bg-slate-100 text-[10px] uppercase text-slate-500">
                  {plantilla.idioma}
                </span>
              </div>
              <p className="truncate text-xs text-slate-400">{plantilla.descripcion}</p>
            </div>
            <button type="button" className="text-xs text-slate-400 hover:text-brand-600">
              Editar
            </button>
            <button type="button" className="text-xs text-slate-400 hover:text-red-500">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Panel 4. Los cuatro números salen de `commissionSettings()`, que ya vivía en
 * `/configuracion`. El vocabulario, en cambio, es el del live: **agente**.
 */
function PanelComisiones() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Comisiones de agentes</h1>
        <p className="text-sm text-slate-500">
          La comisión se calcula sobre el Booking Fee del show. Cada agente tiene su propio %; si un
          artista concreto tiene un override, ese manda (se configura en la ficha del artista). El
          agente oficial y el aprobador de arte también se asignan en la ficha del artista.
        </p>
      </div>

      <section className="card p-5">
        <TituloSeccion>Porcentaje global por defecto</TituloSeccion>
        <div className="flex flex-wrap items-end gap-3">
          <CampoNumero etiqueta="% sobre el Booking Fee" valor={ajustesComision.globalPercent} />
          <button type="button" className="btn-primary text-sm">
            Guardar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Se aplica a los agentes que no tengan un % propio abajo.
        </p>
      </section>

      <section className="card p-5">
        <TituloSeccion>Exclusividad y logística de agenda</TituloSeccion>
        <p className="mb-3 text-xs text-slate-400">
          Valores por defecto para avisar de conflictos al crear un show. Se pueden ajustar en cada
          show. La distancia real (km) se calcula cuando el venue tiene coordenadas (autocompletado
          de Google).
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <CampoNumero etiqueta="Ventana (días)" valor={ajustesComision.exclusivityWindowDays} />
          <CampoNumero
            etiqueta="Radio de exclusividad (km)"
            valor={ajustesComision.exclusivityRadiusKm}
          />
          <CampoNumero
            etiqueta="Salto logístico máx. (km)"
            valor={ajustesComision.logisticJumpKm}
          />
          <button type="button" className="btn-primary text-sm">
            Guardar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Exclusividad: otro show del artista dentro de la ventana de días y del radio en km. Salto
          logístico: dos shows a 1-2 días pero más lejos que este límite (viaje inviable).
        </p>
      </section>

      <section className="card overflow-hidden">
        <div className="px-5 pt-5">
          <TituloSeccion>% de comisión por agente</TituloSeccion>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-2 font-medium">Agente</th>
              <th className="px-5 py-2 font-medium">% de comisión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {AGENTES_COMISION.map((agente) => (
              <tr key={agente}>
                <td className="px-5 py-2 text-slate-700">{agente}</td>
                <td className="px-5 py-2">
                  <span className="flex items-center gap-2">
                    <input
                      type="number"
                      className="input w-20"
                      placeholder={String(ajustesComision.globalPercent)}
                      aria-label={`% de comisión de ${agente}`}
                    />
                    <span className="text-sm text-slate-500">%</span>
                    <span className="text-xs text-slate-400">
                      (global {ajustesComision.globalPercent}%)
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/** Panel 5. */
function PanelAlertas() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{alertas.titulo}</h2>
        <p className="mt-1 text-sm text-slate-500">{alertas.descripcion}</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-medium text-emerald-700">{alertas.banner}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{alertas.nota}</p>
          </div>
          <button type="button" className="btn-secondary shrink-0 text-sm">
            Volver a modo prueba
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary text-sm">
          Evaluar y avisar ahora
        </button>
      </div>

      {alertas.grupos.map((grupo) => (
        <section key={grupo.rol}>
          <div className="mb-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {grupo.rol}
            </h3>
            <p className="text-xs text-slate-400">{grupo.texto}</p>
          </div>
          <div className="space-y-3">
            {grupo.reglas.map((regla) => (
              <div
                key={regla.titulo}
                role="group"
                aria-label={`Regla ${regla.titulo}`}
                className="card p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('h-2 w-2 shrink-0 rounded-full', regla.punto)} />
                      <span className="font-medium text-slate-800">{regla.titulo}</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                      {regla.descripcion}
                    </p>
                  </div>
                  <label className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      defaultChecked={regla.activa}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600"
                      aria-label={`Activa · ${regla.titulo}`}
                    />
                    Activa
                  </label>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <span className="label block">Cuándo salta</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        className="input w-16"
                        defaultValue={regla.dias ?? ''}
                        aria-label={`Días · ${regla.titulo}`}
                      />
                      <select
                        className="input flex-1 text-xs"
                        aria-label={`Cuándo salta · ${regla.titulo}`}
                      >
                        <option value="antes">días antes del show</option>
                        <option value="despues">días después del show</option>
                        <option value="desde_oferta">días desde la oferta</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="label block">Severidad</span>
                    <select className="input" aria-label={`Severidad · ${regla.titulo}`}>
                      <option value="info">Info</option>
                      <option value="warning">Aviso</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        defaultChecked={regla.email}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600"
                        aria-label={`También por email · ${regla.titulo}`}
                      />
                      También por email
                    </label>
                  </div>
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="text-sm">
                      <span className="text-slate-400">Avisa a: </span>
                      <span className="font-medium text-slate-700">{regla.avisa}</span>
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">Cambiar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Panel 6. */
function PanelRecordatorios() {
  const [idioma, setIdioma] = useState<'ES' | 'EN'>('ES');
  const interruptor = useId();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{recordatorios.titulo}</h2>
        <p className="mt-1 text-sm text-slate-500">{recordatorios.descripcion}</p>
      </div>

      <div className="card space-y-4 p-5">
        <div>
          <label className="flex items-center gap-2 text-sm text-slate-700" htmlFor={interruptor}>
            <input
              id={interruptor}
              type="checkbox"
              defaultChecked={recordatorios.activo}
              className="h-4 w-4 rounded border-slate-300 text-brand-600"
            />
            Enviar recordatorios automáticamente
          </label>
          <p className="mt-1 text-xs text-slate-400">
            Si está apagado, no se escribe a ningún cliente (solo se registra internamente).
          </p>
        </div>

        <div>
          <CampoNumero
            etiqueta="Cadencia (días entre recordatorios)"
            valor={recordatorios.cadencia}
          />
          <p className="mt-1 text-xs text-slate-400">
            No se repite el email a la misma factura hasta que pasen estos días.
          </p>
        </div>

        <div>
          <Campo etiqueta="Copia interna (CC)" valor={recordatorios.cc} />
          <p className="mt-1 text-xs text-slate-400">
            Separadas por comas. Reciben copia de cada recordatorio.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="label mb-0">Plantilla del email</span>
            <div className="inline-flex overflow-hidden rounded-lg border border-slate-200">
              {recordatorios.idiomas.map((opcion, i) => (
                <button
                  key={opcion}
                  type="button"
                  aria-pressed={idioma === opcion}
                  onClick={() => setIdioma(opcion as 'ES' | 'EN')}
                  className={cn(
                    'px-3 py-1 text-xs font-medium',
                    i > 0 && 'border-l border-slate-200',
                    idioma === opcion
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Marcadores:{' '}
            {recordatorios.marcadores.map((marcador) => (
              <span
                key={marcador}
                className="mr-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600"
              >
                {marcador}
              </span>
            ))}
          </p>
          <textarea
            className="input mt-2 min-h-[120px]"
            aria-label={`Plantilla del email (${idioma})`}
          />
          <p className="mt-1 text-xs text-slate-400">
            Si dejas el cuerpo vacío, se usa la plantilla estándar del sistema. {'{shows}'} inserta
            la tabla de shows de la factura; los saltos de línea se respetan.
          </p>
        </div>

        <button type="button" className="btn-primary text-sm">
          Guardar
        </button>
      </div>
    </div>
  );
}

/** Panel 7. */
function PanelConfirmacionShow() {
  return (
    <div className="space-y-4">
      <div>
        <TituloSeccion>{confirmacionShow.titulo}</TituloSeccion>
        <p className="text-sm text-slate-500">{confirmacionShow.descripcion}</p>
      </div>

      <div className="card space-y-3 p-5">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Activar el aviso automático al promotor al confirmar un show
        </label>
        <Campo etiqueta="Asunto del correo (opcional; vacío = por defecto)" />
        <div>
          <span className="label block">Texto introductorio del correo (opcional)</span>
          <textarea
            className="input min-h-[90px]"
            aria-label="Texto introductorio del correo (opcional)"
          />
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Variables disponibles (asunto y texto)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {confirmacionShow.variables.map((variable) => (
              <span
                key={variable.clave}
                title={variable.explicacion}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
              >
                <code className="text-brand-700">{variable.clave}</code>
                <span className="text-slate-400">{variable.explicacion}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-slate-800">Campos esenciales</h3>
          <p className="text-xs text-slate-400">
            Por página del show. <b>Informativo</b> = se muestra si está; <b>Amarillo</b> = se le
            pide al promotor si falta; <b>No aparece</b> = se omite del correo.
          </p>
        </div>
        {confirmacionShow.secciones.map((seccion) => (
          <div key={seccion.titulo} className="border-b border-slate-100 last:border-0">
            <div className="bg-slate-50 px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {seccion.titulo}
            </div>
            {seccion.campos.map((campo) => (
              <div
                key={campo.nombre}
                role="group"
                aria-label={`Campo esencial ${campo.nombre}`}
                className="flex flex-wrap items-center gap-3 px-5 py-2.5 text-sm"
              >
                <span className="min-w-[14rem] flex-1 text-slate-700">{campo.nombre}</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    defaultChecked={campo.obligatorio}
                    aria-label="Obligatorio"
                  />
                  Obligatorio
                </label>
                <select
                  className="select w-40 shrink-0 text-sm"
                  aria-label={`Cómo aparece ${campo.nombre}`}
                >
                  {confirmacionShow.presentacion.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="card p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800">Mensajes personalizados</h3>
          <button type="button" className="btn-secondary text-xs">
            + Añadir mensaje
          </button>
        </div>
        <p className="mb-3 text-xs text-slate-400">
          Recordatorios que se añaden al final del correo (p. ej. «Hasta que no se firme el contrato
          y se realice el primer pago no se podrá anunciar el show»).
        </p>
        <p className="text-sm text-slate-400">{confirmacionShow.vacioMensajes}</p>
      </section>

      <button type="button" className="btn-primary text-sm">
        Guardar ajustes
      </button>
    </div>
  );
}

function SelectorColor({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-600">
      <input
        type="color"
        className="h-8 w-10 cursor-pointer rounded border border-slate-200"
        defaultValue={valor}
        aria-label={`Color ${etiqueta}`}
      />
      <span className="min-w-0">
        <span className="block font-medium">{etiqueta}</span>
        <span className="text-[11px] uppercase text-slate-400">{valor}</span>
      </span>
    </label>
  );
}

/** Panel 8. */
function PanelFormularioOfertas() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Formulario activo</h2>
          <p className="mt-1 text-xs text-slate-400">{formularioOfertas.descripcion}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-emerald-600 bg-emerald-600 px-3 py-1 text-xs font-medium text-white"
        >
          ✓ Activo
        </button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Campos del formulario</h3>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left">Etiqueta (ES / EN)</th>
                <th className="px-2 py-2 text-center">Visible</th>
                <th className="px-2 py-2 text-center">Obligatorio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {formularioOfertas.campos.map((campo) => (
                <tr key={campo.clave}>
                  <td className="px-3 py-1.5">
                    <div className="flex flex-col gap-1 sm:flex-row">
                      <input
                        className="input h-7 text-xs"
                        defaultValue={campo.es}
                        aria-label={`Etiqueta ES de ${campo.clave}`}
                      />
                      <input
                        className="input h-7 text-xs"
                        defaultValue={campo.en}
                        aria-label={`Etiqueta EN de ${campo.clave}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {campo.clave} · {campo.tipo}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input
                      type="checkbox"
                      defaultChecked={campo.visible}
                      aria-label={`Visible ${campo.clave}`}
                    />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input
                      type="checkbox"
                      defaultChecked={campo.obligatorio}
                      aria-label={`Obligatorio ${campo.clave}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700">Colores del formulario</h3>
        <p className="mb-3 mt-1 text-xs text-slate-400">
          Un único tema para el formulario de todos los artistas. El fondo es un degradado de dos
          colores sobre un color base; el acento colorea el botón de enviar.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          {formularioOfertas.colores.map((color) => (
            <SelectorColor key={color.etiqueta} etiqueta={color.etiqueta} valor={color.valor} />
          ))}
        </div>
        <button type="button" className="btn-secondary mt-3 text-xs">
          Restablecer colores por defecto
        </button>
      </section>

      <section className="card p-5">
        <h3 className="text-sm font-semibold text-slate-700">
          Colores del embed (insertado en la web)
        </h3>
        <p className="mb-3 mt-1 text-xs text-slate-400">
          Cuando el formulario se inserta en la web va sin cabecera. Por defecto el fondo es
          transparente (hereda el de la web); aquí eliges el color del texto, las líneas de los
          campos y el botón.
        </p>
        <label className="mb-3 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-slate-300 text-brand-600"
          />
          Fondo transparente (heredar el de la web)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          {formularioOfertas.coloresEmbed.map((color) => (
            <SelectorColor key={color.etiqueta} etiqueta={color.etiqueta} valor={color.valor} />
          ))}
        </div>
        <button type="button" className="btn-secondary mt-3 text-xs">
          Restablecer
        </button>
      </section>

      <button type="button" className="btn-primary text-sm">
        Guardar cambios
      </button>
    </div>
  );
}

/** Panel 9. Como Contratos, en el live es una página entera embebida. */
function PanelExtrasLogistica() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Extras de logística</h1>
        <p className="text-sm text-slate-500">
          Peticiones estándar por línea (viaje, transporte, hospedaje, dietas). Se seleccionan con
          un clic en cada show y salen en el contrato <strong>en el idioma de su plantilla</strong>{' '}
          (por eso van con etiqueta ES + EN). Los marcados <strong>por defecto</strong> se
          preseleccionan en los shows nuevos.
        </p>
      </div>
      {extrasLogistica.map((linea) => (
        <section key={linea.linea} className="card mb-6 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {linea.linea}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-2">Etiqueta (ES)</th>
                  <th className="px-4 py-2">Label (EN)</th>
                  <th className="px-4 py-2 text-center">Por defecto</th>
                  <th className="px-4 py-2 text-center">Activo</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {linea.filas.map((fila) => (
                  <tr key={fila.es}>
                    <td className="px-4 py-2">
                      <input
                        className="input h-9 w-full min-w-40"
                        defaultValue={fila.es}
                        aria-label={`Etiqueta ES de ${fila.es}`}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        className="input h-9 w-full min-w-40"
                        defaultValue={fila.en}
                        aria-label={`Label EN de ${fila.es}`}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        defaultChecked={fila.porDefecto}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600"
                        aria-label={`Por defecto ${fila.es}`}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        defaultChecked={fila.activo}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600"
                        aria-label={`Activo ${fila.es}`}
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        className="text-xs font-medium text-rose-500 hover:text-rose-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-right">
            <button type="button" className="btn-secondary text-xs">
              Añadir
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

/** Panel 10. */
function PanelCalendarioGoogle() {
  const sincro = useId();
  return (
    <div className="space-y-4">
      <section className="card p-5">
        <TituloSeccion>{calendarioGoogle.titulo}</TituloSeccion>
        <p className="mb-3 text-xs text-slate-400">{calendarioGoogle.descripcion}</p>
        <label className="flex items-center gap-2 text-sm text-slate-700" htmlFor={sincro}>
          <input
            id={sincro}
            type="checkbox"
            defaultChecked={calendarioGoogle.sincronizacionActiva}
            className="h-4 w-4 rounded border-slate-300 text-brand-600"
          />
          Sincronización activa
        </label>
        <p className="mt-1 text-xs text-slate-400">
          Con esto apagado, el cron no hace nada aunque esté programado.
        </p>
        <div className="mt-4">
          <Campo etiqueta="Plantilla del título del evento" valor={calendarioGoogle.plantilla} />
          <p className="mt-1 text-xs text-slate-400">
            Variables disponibles: {'{estado}'} {'{show}'} {'{venue}'} {'{ciudad}'} {'{artista}'} —
            esta última existe por si algún día la necesitas, pero por defecto no se usa (es el
            calendario del propio artista). Para los holds, el estado sale como Tentative/Hold/
            Confirmed y el resto del título es lo que escribiste al crearlo.
          </p>
        </div>
      </section>

      <section className="card p-5">
        <TituloSeccion>Qué más incluir en la descripción</TituloSeccion>
        <p className="mb-2 text-xs text-slate-400">
          El título ya lleva estado, venue y ciudad — aquí va el resto: el nombre de la fiesta
          («Event», si lo tiene) siempre sale el primero; lo demás es configurable.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {calendarioGoogle.incluir.map((opcion) => (
            <Casilla key={opcion.texto} etiqueta={opcion.texto} marcada={opcion.marcado} />
          ))}
        </div>
      </section>

      <section className="card p-5">
        <TituloSeccion>Ventana de lectura del calendario</TituloSeccion>
        <p className="mb-3 text-xs text-slate-400">
          Cuánto hacia atrás y hacia delante miramos en Google al leer eventos que no son nuestros
          (para poder hacer «Upgrade a Show»). Súbela mientras migras el histórico de Gigwell, para
          no dejarte ninguno fuera de rango — luego puedes volver a estrecharla.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
          <CampoNumero
            etiqueta="Días hacia atrás"
            valor={calendarioGoogle.diasAtras}
            ancho="w-full"
          />
          <CampoNumero
            etiqueta="Días hacia delante"
            valor={calendarioGoogle.diasDelante}
            ancho="w-full"
          />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Cuenta de servicio de Google
        </h2>
        <p className="mb-3 text-xs text-slate-400">
          Para que un calendario se sincronice, compártelo (permiso «Hacer cambios en los eventos»)
          con este email:
        </p>
        <code className="block rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
          {calendarioGoogle.email}
        </code>
        <p className="mt-3 text-xs text-slate-400">
          El Calendar ID de cada artista se enlaza desde su ficha (pestaña Perfil). Ahora mismo hay{' '}
          <strong className="text-slate-600">{calendarioGoogle.enlazados.conCalendario}</strong> de{' '}
          {calendarioGoogle.enlazados.total} artistas con calendario enlazado.
        </p>
      </section>

      <section className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Probar ahora
          </h2>
          <button type="button" className="btn-secondary text-xs">
            Sincronizar ahora
          </button>
        </div>
        <p className="text-xs text-slate-400">
          No hace falta esperar al cron (cada 15 min): esto lanza una pasada ya mismo, para todos
          los artistas enlazados.
        </p>
      </section>
    </div>
  );
}

const PANELES: Record<string, () => ReactElement> = {
  'Datos fiscales': PanelDatosFiscales,
  'Ocultar movimientos': PanelOcultarMovimientos,
  Contratos: PanelContratos,
  'Comisiones y exclusividad': PanelComisiones,
  Alertas: PanelAlertas,
  Recordatorios: PanelRecordatorios,
  'Confirmación de show': PanelConfirmacionShow,
  'Formulario de ofertas': PanelFormularioOfertas,
  'Extras de logística': PanelExtrasLogistica,
  'Calendario Google': PanelCalendarioGoogle,
};

export function AjustesPage() {
  const [panel, setPanel] = useState(PANEL_POR_DEFECTO);
  const Panel = PANELES[panel];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-800">Ajustes de ConceptOne</h1>
        <p className="text-sm text-slate-500">
          Configuración del espacio de booking: administración, alertas, configuración y conexiones.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav className="shrink-0 lg:w-56">
          <div className="space-y-4">
            {GRUPOS_AJUSTES.map((grupo) => (
              <div key={grupo.titulo}>
                <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {grupo.titulo}
                </div>
                <div className="space-y-0.5">
                  {grupo.paneles.map((nombre) => (
                    <button
                      key={nombre}
                      type="button"
                      aria-current={panel === nombre ? 'page' : undefined}
                      onClick={() => setPanel(nombre)}
                      className={cn(
                        'w-full rounded-lg px-3 py-1.5 text-left text-sm font-medium transition-colors',
                        panel === nombre
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      )}
                    >
                      {nombre}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
        <div className="min-w-0 flex-1">
          <Panel />
        </div>
      </div>
    </div>
  );
}
