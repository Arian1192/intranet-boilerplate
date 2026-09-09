import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import {
  incidentes as todasLasIncidencias,
  TOTAL_INCIDENTES,
  ESTADOS_INCIDENTE,
  SEVERIDADES_INCIDENTE,
  CATEGORIAS_INCIDENTE,
  OWNERS_INCIDENTE,
  DEPARTAMENTOS_INCIDENTE,
  FILTROS_GUARDADOS,
  FILTROS_INCIDENTES_VACIO,
  agruparPorEstado,
  agruparPorMes,
  aplicarFiltroGuardado,
  edadDias,
  edadEsVieja,
  estadoMeta,
  etiquetaEdad,
  filterIncidentes,
  formatFechaIncidente,
  ordenarPorSeveridad,
  severidadMeta,
  type FiltrosIncidentes,
  type Incidente,
  type VistaIncidentes,
} from '../../data/incidentes';

const VISTAS: VistaIncidentes[] = ['tabla', 'tablero', 'timeline'];

const COLUMNAS = [
  'Código',
  'Título',
  'Departamento',
  'Categoría',
  'Severidad ↓',
  'Estado',
  'Owner',
  'Edad',
];

function Edad({ incidente }: { incidente: Incidente }) {
  const dias = edadDias(incidente);
  return (
    <span className={cn(edadEsVieja(dias) && 'font-semibold text-rose-600')}>
      {etiquetaEdad(dias)}
    </span>
  );
}

export function IncidentesPage() {
  const [filtros, setFiltros] = useState<FiltrosIncidentes>(FILTROS_INCIDENTES_VACIO);
  const [guardado, setGuardado] = useState<string | null>('sin-cerrar');
  const [masFiltros, setMasFiltros] = useState(false);
  const [vista, setVista] = useState<VistaIncidentes>('tabla');

  const set = <K extends keyof FiltrosIncidentes>(campo: K, valor: FiltrosIncidentes[K]) =>
    setFiltros((previos) => ({ ...previos, [campo]: valor }));

  const limpiar = () => {
    setFiltros(FILTROS_INCIDENTES_VACIO);
    setGuardado(null);
  };

  const filtradas = useMemo(
    () => filterIncidentes(aplicarFiltroGuardado(todasLasIncidencias, guardado), filtros),
    [filtros, guardado]
  );

  const porSeveridad = useMemo(() => ordenarPorSeveridad(filtradas), [filtradas]);
  const columnas = useMemo(() => agruparPorEstado(filtradas), [filtradas]);
  const meses = useMemo(() => agruparPorMes(filtradas), [filtradas]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Incidentes</h1>
          <p className="text-sm text-slate-500">
            {filtradas.length} de {TOTAL_INCIDENTES} incidentes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link className="btn-secondary" to="/management/incidentes/analitica">
            Analítica
          </Link>
          <button type="button" className="btn-primary">
            + Incidente
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS_GUARDADOS.map((filtro) => {
          const activo = guardado === filtro.id;
          return (
            <button
              key={filtro.id}
              type="button"
              aria-pressed={activo}
              onClick={() => setGuardado(activo ? null : filtro.id)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                activo
                  ? 'bg-slate-800 text-white'
                  : filtro.tono === 'rose'
                    ? 'border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              )}
            >
              {filtro.etiqueta}
            </button>
          );
        })}
        <button
          type="button"
          onClick={limpiar}
          className="rounded-full px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="card space-y-3 p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <label className="label" htmlFor="incidentes-estado">
              Estado
            </label>
            <select
              id="incidentes-estado"
              className="select"
              value={filtros.estado}
              onChange={(e) => set('estado', e.target.value as FiltrosIncidentes['estado'])}
            >
              <option value="">Todos</option>
              <option value="__abierto__">Abiertos (sin resolver)</option>
              {ESTADOS_INCIDENTE.map((estado) => (
                <option key={estado.valor} value={estado.valor}>
                  {estado.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="incidentes-severidad">
              Severidad
            </label>
            <select
              id="incidentes-severidad"
              className="select"
              value={filtros.severidad}
              onChange={(e) => set('severidad', e.target.value as FiltrosIncidentes['severidad'])}
            >
              <option value="">Todas</option>
              {SEVERIDADES_INCIDENTE.map((severidad) => (
                <option key={severidad.valor} value={severidad.valor}>
                  {severidad.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="incidentes-categoria">
              Categoría
            </label>
            <select
              id="incidentes-categoria"
              className="select"
              value={filtros.categoria}
              onChange={(e) => set('categoria', e.target.value)}
            >
              <option value="">Todas</option>
              {CATEGORIAS_INCIDENTE.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="incidentes-artista">
              Artista
            </label>
            <div className="relative">
              <input
                id="incidentes-artista"
                className="input"
                placeholder="Buscar artista…"
                value={filtros.artista}
                onChange={(e) => set('artista', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="incidentes-owner">
              Owner
            </label>
            <select
              id="incidentes-owner"
              className="select"
              value={filtros.owner}
              onChange={(e) => set('owner', e.target.value)}
            >
              <option value="">Todos</option>
              {OWNERS_INCIDENTE.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="incidentes-desde">
              Desde
            </label>
            <input
              id="incidentes-desde"
              type="date"
              className="input"
              value={filtros.desde}
              onChange={(e) => set('desde', e.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="incidentes-hasta">
              Hasta
            </label>
            <input
              id="incidentes-hasta"
              type="date"
              className="input"
              value={filtros.hasta}
              onChange={(e) => set('hasta', e.target.value)}
            />
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <label className="label" htmlFor="incidentes-texto">
              Buscar (título / contraparte)
            </label>
            <input
              id="incidentes-texto"
              className="input"
              placeholder="Texto…"
              value={filtros.texto}
              onChange={(e) => set('texto', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMasFiltros((abierto) => !abierto)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            {masFiltros ? '− Menos filtros' : '+ Más filtros'}
          </button>
          <div className="flex overflow-hidden rounded-lg border border-slate-200">
            {VISTAS.map((opcion) => (
              <button
                key={opcion}
                type="button"
                aria-pressed={vista === opcion}
                onClick={() => setVista(opcion)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium capitalize',
                  vista === opcion
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>

        {masFiltros && (
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3">
            <label
              className="flex items-center gap-2 text-sm text-slate-600"
              htmlFor="incidentes-preventable"
            >
              <input
                id="incidentes-preventable"
                type="checkbox"
                checked={filtros.preventable}
                onChange={(e) => set('preventable', e.target.checked)}
              />{' '}
              Preventable
            </label>
            <label
              className="flex items-center gap-2 text-sm text-slate-600"
              htmlFor="incidentes-escalado"
            >
              <input
                id="incidentes-escalado"
                type="checkbox"
                checked={filtros.escalado}
                onChange={(e) => set('escalado', e.target.checked)}
              />{' '}
              Escalado
            </label>
            <label
              className="flex items-center gap-2 text-sm text-slate-600"
              htmlFor="incidentes-confidencial"
            >
              <input
                id="incidentes-confidencial"
                type="checkbox"
                checked={filtros.confidencial}
                onChange={(e) => set('confidencial', e.target.checked)}
              />{' '}
              Confidencial
            </label>
            <label
              className="flex items-center gap-2 text-sm text-slate-600"
              htmlFor="incidentes-relacionados"
            >
              <input
                id="incidentes-relacionados"
                type="checkbox"
                checked={filtros.conRelacionados}
                onChange={(e) => set('conRelacionados', e.target.checked)}
              />{' '}
              Con relacionados
            </label>
            <label
              className="flex items-center gap-2 text-sm text-slate-600"
              htmlFor="incidentes-impacto"
            >
              Impacto económico ≥
              <input
                id="incidentes-impacto"
                type="number"
                className="input w-28"
                placeholder="€"
                value={filtros.impactoMinimo ?? ''}
                onChange={(e) =>
                  set('impactoMinimo', e.target.value === '' ? null : Number(e.target.value))
                }
              />
            </label>
          </div>
        )}
      </div>

      {vista === 'tabla' && (
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                {COLUMNAS.map((columna) => (
                  <th
                    key={columna}
                    className="cursor-pointer select-none px-3 py-2 font-medium hover:text-slate-600"
                  >
                    {columna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {porSeveridad.map((incidente) => (
                <tr
                  key={incidente.codigo}
                  className="cursor-pointer border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500">
                    {incidente.codigo}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800">{incidente.titulo}</span>
                      {incidente.confidencial && <span title="Confidencial">🔒</span>}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                    {incidente.departamento}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-500">
                    {incidente.categoria ?? '—'}
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn('badge', severidadMeta(incidente.severidad).badge)}>
                      {severidadMeta(incidente.severidad).etiqueta}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn('badge', estadoMeta(incidente.estado).badge)}>
                      {estadoMeta(incidente.estado).etiqueta}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {incidente.owner ?? <span className="text-slate-400">Sin asignar</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-center">
                    <Edad incidente={incidente} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {vista === 'tablero' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {columnas.map((columna) => (
            <div
              key={columna.estado.valor}
              role="group"
              aria-label={`Columna ${columna.estado.etiqueta}`}
              className="rounded-lg bg-slate-50 p-2"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className={cn('badge', columna.estado.badge)}>{columna.estado.etiqueta}</span>
                <span className="text-xs text-slate-400">{columna.incidentes.length}</span>
              </div>
              <div className="space-y-2">
                {columna.incidentes.length === 0 ? (
                  <div className="px-1 py-4 text-center text-xs text-slate-300">Vacío</div>
                ) : (
                  columna.incidentes.map((incidente) => (
                    <button
                      key={incidente.codigo}
                      type="button"
                      className="card w-full space-y-1.5 p-2.5 text-left hover:shadow"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="line-clamp-2 text-sm font-medium text-slate-800">
                          {incidente.titulo}
                        </span>
                        <span
                          className={cn('badge shrink-0', severidadMeta(incidente.severidad).badge)}
                        >
                          {severidadMeta(incidente.severidad).etiqueta}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        {incidente.owner ?? <span className="text-slate-400">Sin asignar</span>}
                        <Edad incidente={incidente} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {vista === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="label mb-0" htmlFor="incidentes-departamento">
              Departamento
            </label>
            <select
              id="incidentes-departamento"
              className="select w-56"
              value={filtros.departamento}
              onChange={(e) => set('departamento', e.target.value)}
            >
              <option value="">Todos</option>
              {DEPARTAMENTOS_INCIDENTE.map((departamento) => (
                <option key={departamento} value={departamento}>
                  {departamento}
                </option>
              ))}
            </select>
          </div>
          {meses.map((mes) => (
            <div key={mes.clave} className="card p-4">
              <h3 className="mb-3 text-sm font-semibold capitalize text-slate-700">
                {mes.etiqueta}{' '}
                <span className="font-normal text-slate-400">· {mes.incidentes.length}</span>
              </h3>
              <div className="space-y-1.5">
                {mes.incidentes.map((incidente) => (
                  <button
                    key={incidente.codigo}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm hover:bg-slate-50"
                  >
                    <span className="w-20 shrink-0 text-xs text-slate-400">
                      {formatFechaIncidente(incidente.fechaReporte)}
                    </span>
                    <span
                      className={cn(
                        'h-2 w-2 shrink-0 rounded-full',
                        severidadMeta(incidente.severidad).punto
                      )}
                    />
                    <span className="flex-1 truncate text-slate-800">{incidente.titulo}</span>
                    <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
                      {incidente.departamento}
                    </span>
                    <span className={cn('badge shrink-0', estadoMeta(incidente.estado).badge)}>
                      {estadoMeta(incidente.estado).etiqueta}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
