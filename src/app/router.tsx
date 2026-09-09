import { Routes, Route } from 'react-router';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ConceptOneShell } from '@/features/modules/ConceptOneShell';
import { EtraShell } from '@/features/modules/EtraShell';
import { ProduccionShell } from '@/features/modules/ProduccionShell';
import { CrudaShell } from '@/features/modules/CrudaShell';
import { EuphoricShell } from '@/features/modules/EuphoricShell';
import { CreativosShell } from '@/features/modules/CreativosShell';
import { CRMShell } from '@/features/modules/CRMShell';
import { TeamShell } from '@/features/team/TeamShell';
import { EquipoPage } from '@/features/team/pages/EquipoPage';
import { UsuariosPage } from '@/features/team/usuarios/UsuariosPage';
import { CalendarioPage } from '@/features/team/pages/CalendarioPage';
import { FichasPage } from '@/features/team/pages/FichasPage';
import { ConfigShell } from '@/features/modules/ConfigShell';
import { PlantillasCorreoPage } from '@/features/configuracion/pages/PlantillasCorreoPage';
import { UsoPage } from '@/features/configuracion/pages/UsoPage';
import { IncidenciasPage as ConfiguracionIncidenciasPage } from '@/features/configuracion/pages/IncidenciasPage';
import { DocumentosTipografiaPage } from '@/features/configuracion/pages/DocumentosTipografiaPage';
import { NotificacionesPage } from '@/features/configuracion/pages/NotificacionesPage';
import { ComisionesBookersPage } from '@/features/configuracion/pages/ComisionesBookersPage';
import { ControlComisionesPage } from '@/features/configuracion/pages/ControlComisionesPage';
import { ContratosPage } from '@/features/configuracion/pages/ContratosPage';
import { AlertasEventosPage } from '@/features/configuracion/pages/AlertasEventosPage';
import { RrhhPage } from '@/features/configuracion/pages/RrhhPage';
import { FestivosPage } from '@/features/configuracion/pages/FestivosPage';
import { MiTrabajoShell } from '@/features/modules/MiTrabajoShell';
import { IncidenciasShell } from '@/features/modules/IncidenciasShell';
import { MixmagShell } from '@/features/modules/MixmagShell';
import { TagmagShell } from '@/features/modules/TagmagShell';
import { HerramientasShell } from '@/features/modules/HerramientasShell';
import { HerramientasResumenPage } from '@/features/herramientas/pages/HerramientasResumenPage';
import { ProyeccionesListPage } from '@/features/herramientas/pages/ProyeccionesListPage';
import { ProyeccionDetailPage } from '@/features/herramientas/pages/ProyeccionDetailPage';
import { BookingDashboardPage } from '@/features/booking/pages/BookingDashboardPage';
import { ShowsPage } from '@/features/booking/pages/ShowsPage';
import { CalendarioPage as BookingCalendarioPage } from '@/features/booking/pages/CalendarioPage';
import { DisponibilidadPage } from '@/features/booking/pages/DisponibilidadPage';
import { ContactosPage } from '@/features/booking/pages/ContactosPage';
import { OfertasPage } from '@/features/booking/pages/OfertasPage';
import { CobrosPage } from '@/features/booking/pages/CobrosPage';
import { GastosPage } from '@/features/booking/pages/GastosPage';
import { EstrategiasPage } from '@/features/booking/pages/EstrategiasPage';
import { ToursPage } from '@/features/booking/pages/ToursPage';
import { LiquidacionesPage } from '@/features/booking/pages/LiquidacionesPage';
import { PendientesPage } from '@/features/booking/pages/PendientesPage';
import { ArtistasPage as C1ArtistasPage } from '@/features/booking/pages/ArtistasPage';
import { ReportePage } from '@/features/booking/pages/ReportePage';
import { AjustesPage as ConceptOneAjustesPage } from '@/features/booking/pages/AjustesPage';
import { RosterPage } from '@/features/booking/pages/management/RosterPage';
import { InsightsPage } from '@/features/booking/pages/management/InsightsPage';
import { ContratosPage as ManagementContratosPage } from '@/features/booking/pages/management/ContratosPage';
import { ActivacionesPage } from '@/features/booking/pages/management/ActivacionesPage';
import { CampanasPage as ManagementCampanasPage } from '@/features/booking/pages/management/CampanasPage';
import { ContentPage } from '@/features/booking/pages/management/ContentPage';
import { IncidentesPage } from '@/features/booking/pages/management/IncidentesPage';
import { IncidentesAnaliticaPage } from '@/features/booking/pages/management/IncidentesAnaliticaPage';
import { EtraDashboardPage } from '@/features/etra/pages/EtraDashboardPage';
import { ActionsPage } from '@/features/etra/pages/ActionsPage';
import { ActionDetailPage } from '@/features/etra/pages/ActionDetailPage';
import { SeedingPage } from '@/features/etra/pages/SeedingPage';
import { AccountsPage } from '@/features/etra/pages/AccountsPage';
import { EventsPage } from '@/features/produccion/pages/EventsPage';
import { ResumenPage } from '@/features/euphoric/pages/ResumenPage';
import { CampanasPage } from '@/features/euphoric/pages/CampanasPage';
import { ContenidoPage } from '@/features/euphoric/pages/ContenidoPage';
import { PiezasPage } from '@/features/piezas/pages/PiezasPage';
import { EventosPage } from '@/features/euphoric/pages/EventosPage';
import { CuentasPage } from '@/features/euphoric/pages/CuentasPage';
import { AnaliticaPage } from '@/features/euphoric/pages/AnaliticaPage';
import { ArtistasPage } from '@/features/euphoric/pages/ArtistasPage';
import { AgendaPage } from '@/features/euphoric/pages/AgendaPage';
import { AjustesPage } from '@/features/euphoric/pages/AjustesPage';
import { NegocioLayout } from '@/features/euphoric/components/NegocioLayout';
import { DireccionPage } from '@/features/euphoric/pages/negocio/DireccionPage';
import { PipelinePage as EuphoricPipelinePage } from '@/features/euphoric/pages/negocio/PipelinePage';
import { PresupuestosPage } from '@/features/euphoric/pages/negocio/PresupuestosPage';
import { TiemposPage } from '@/features/euphoric/pages/negocio/TiemposPage';
import { ResumenPage as RedaccionResumenPage } from '@/features/redaccion/pages/ResumenPage';
import { RevistasPage } from '@/features/redaccion/pages/RevistasPage';
import { ContenidosPage } from '@/features/redaccion/pages/ContenidosPage';
import { CampanasPage as RedaccionCampanasPage } from '@/features/redaccion/pages/CampanasPage';
import { PedidosPage } from '@/features/cruda/pages/PedidosPage';
import { CatalogoPage } from '@/features/cruda/pages/CatalogoPage';
import { AnaliticaPage as CrudaAnaliticaPage } from '@/features/cruda/pages/AnaliticaPage';
import { CreativosPage } from '@/features/piezas/pages/CreativosPage';
import { ClientesPage } from '@/features/crm/pages/ClientesPage';
import { PipelinePage } from '@/features/crm/pages/PipelinePage';
import { CrecimientoPage } from '@/features/crm/pages/CrecimientoPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route element={<ConceptOneShell />}>
        {/* Bookings */}
        <Route path="/conceptone" element={<BookingDashboardPage />} />
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/ofertas" element={<OfertasPage />} />
        <Route path="/cobros" element={<CobrosPage />} />
        <Route path="/gastos" element={<GastosPage />} />
        <Route path="/liquidaciones" element={<LiquidacionesPage />} />
        <Route path="/disponibilidad" element={<DisponibilidadPage />} />
        <Route path="/calendario-c1" element={<BookingCalendarioPage />} />
        <Route path="/contactos" element={<ContactosPage />} />
        <Route path="/conceptone/pendientes" element={<PendientesPage />} />
        {/* Management */}
        <Route path="/management/roster" element={<RosterPage />} />
        <Route path="/management/insights" element={<InsightsPage />} />
        <Route path="/management/estrategias" element={<EstrategiasPage />} />
        <Route path="/management/contratos" element={<ManagementContratosPage />} />
        <Route path="/management/activaciones" element={<ActivacionesPage />} />
        <Route path="/management/campanas" element={<ManagementCampanasPage />} />
        <Route path="/management/content" element={<ContentPage />} />
        <Route path="/management/incidentes" element={<IncidentesPage />} />
        <Route path="/management/incidentes/analitica" element={<IncidentesAnaliticaPage />} />
        {/* Más */}
        <Route path="/artistas" element={<C1ArtistasPage />} />
        <Route path="/reporte" element={<ReportePage />} />
        <Route path="/conceptone/ajustes" element={<ConceptOneAjustesPage />} />
      </Route>
      <Route path="/etra" element={<EtraShell />}>
        <Route index element={<EtraDashboardPage />} />
        <Route path="tareas" element={<ActionsPage />} />
        <Route path="tareas/:actionId" element={<ActionDetailPage />} />
        <Route path="seeding" element={<SeedingPage />} />
        <Route path="cuentas" element={<AccountsPage />} />
      </Route>
      <Route path="/produccion" element={<ProduccionShell />}>
        <Route index element={<EventsPage />} />
        <Route path=":eventId" element={<EventsPage />} />
      </Route>
      <Route path="/euphoric" element={<EuphoricShell />}>
        <Route index element={<ResumenPage />} />
        <Route path="campanas" element={<CampanasPage />} />
        <Route path="calendario" element={<ContenidoPage />} />
        <Route path="piezas" element={<PiezasPage />} />
        <Route path="eventos" element={<EventosPage />} />
        <Route path="cuentas" element={<CuentasPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="negocio" element={<NegocioLayout />}>
          <Route index element={<DireccionPage />} />
          <Route path="pipeline" element={<EuphoricPipelinePage />} />
          <Route path="presupuestos" element={<PresupuestosPage />} />
          <Route path="analitica" element={<AnaliticaPage />} />
          <Route path="tiempos" element={<TiemposPage />} />
        </Route>
        <Route path="artistas" element={<ArtistasPage />} />
        <Route path="ajustes" element={<AjustesPage />} />
      </Route>
      <Route path="/creativos" element={<CreativosShell />}>
        <Route index element={<CreativosPage />} />
      </Route>
      <Route path="/cruda" element={<CrudaShell />}>
        <Route index element={<PedidosPage />} />
        <Route path="catalogo" element={<CatalogoPage />} />
        <Route path="analitica" element={<CrudaAnaliticaPage />} />
      </Route>
      <Route path="/crm" element={<CRMShell />}>
        <Route index element={<ClientesPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="crecimiento" element={<CrecimientoPage />} />
      </Route>
      <Route path="/personal" element={<TeamShell />}>
        <Route index element={<EquipoPage />} />
        <Route path="calendario" element={<CalendarioPage />} />
        <Route path="fichas" element={<FichasPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
      </Route>
      <Route path="/configuracion" element={<ConfigShell />}>
        <Route index element={<PlantillasCorreoPage />} />
        <Route path="uso" element={<UsoPage />} />
        <Route path="incidencias" element={<ConfiguracionIncidenciasPage />} />
        <Route path="documentos" element={<DocumentosTipografiaPage />} />
        <Route path="notificaciones" element={<NotificacionesPage />} />
        <Route path="comisiones" element={<ComisionesBookersPage />} />
        <Route path="comisiones-pagos" element={<ControlComisionesPage />} />
        <Route path="contratos" element={<ContratosPage />} />
        <Route path="alertas" element={<AlertasEventosPage />} />
        <Route path="rrhh" element={<RrhhPage />} />
        <Route path="festivos" element={<FestivosPage />} />
      </Route>
      <Route path="/mi-trabajo" element={<MiTrabajoShell />} />
      <Route path="/incidencias" element={<IncidenciasShell />} />
      <Route path="/mixmag" element={<MixmagShell />}>
        <Route index element={<RedaccionResumenPage />} />
        <Route path="contenidos" element={<ContenidosPage />} />
        <Route path="campanas" element={<RedaccionCampanasPage />} />
        <Route path="revistas" element={<RevistasPage />} />
      </Route>
      <Route path="/tagmag" element={<TagmagShell />}>
        <Route index element={<RedaccionResumenPage />} />
        <Route path="contenidos" element={<ContenidosPage />} />
        <Route path="campanas" element={<RedaccionCampanasPage />} />
        <Route path="revistas" element={<RevistasPage />} />
      </Route>
      <Route path="/herramientas" element={<HerramientasShell />}>
        <Route index element={<HerramientasResumenPage />} />
        <Route path="proyecciones" element={<ProyeccionesListPage />} />
        <Route path="proyecciones/:id" element={<ProyeccionDetailPage />} />
      </Route>
    </Routes>
  );
}
