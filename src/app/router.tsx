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
import { CalendarioPage } from '@/features/team/pages/CalendarioPage';
import { FichasPage } from '@/features/team/pages/FichasPage';
import { ConfigShell } from '@/features/modules/ConfigShell';
import { MiTrabajoShell } from '@/features/modules/MiTrabajoShell';
import { MixmagShell } from '@/features/modules/MixmagShell';
import { TagmagShell } from '@/features/modules/TagmagShell';
import { HerramientasShell } from '@/features/modules/HerramientasShell';
import { BookingDashboardPage } from '@/features/booking/pages/BookingDashboardPage';
import { ShowsPage } from '@/features/booking/pages/ShowsPage';
import { LogisticsPage } from '@/features/booking/pages/LogisticsPage';
import { ArtistsPage } from '@/features/booking/pages/ArtistsPage';
import { AnalyticsPage } from '@/features/booking/pages/AnalyticsPage';
import { EtraDashboardPage } from '@/features/etra/pages/EtraDashboardPage';
import { ActionsPage } from '@/features/etra/pages/ActionsPage';
import { ActionDetailPage } from '@/features/etra/pages/ActionDetailPage';
import { SeedingPage } from '@/features/etra/pages/SeedingPage';
import { AccountsPage } from '@/features/etra/pages/AccountsPage';
import { EventsPage } from '@/features/produccion/pages/EventsPage';
import { ResumenPage } from '@/features/euphoric/pages/ResumenPage';
import { CampanasPage } from '@/features/euphoric/pages/CampanasPage';
import { ContenidoPage } from '@/features/euphoric/pages/ContenidoPage';
import { PiezasPage } from '@/features/euphoric/pages/PiezasPage';
import { EventosPage } from '@/features/euphoric/pages/EventosPage';
import { CuentasPage } from '@/features/euphoric/pages/CuentasPage';
import { AnaliticaPage } from '@/features/euphoric/pages/AnaliticaPage';
import { ArtistasPage } from '@/features/euphoric/pages/ArtistasPage';
import { ResumenPage as RedaccionResumenPage } from '@/features/redaccion/pages/ResumenPage';
import { RevistasPage } from '@/features/redaccion/pages/RevistasPage';
import { ContenidosPage } from '@/features/redaccion/pages/ContenidosPage';
import { CampanasPage as RedaccionCampanasPage } from '@/features/redaccion/pages/CampanasPage';
import { PedidosPage } from '@/features/cruda/pages/PedidosPage';
import { CatalogoPage } from '@/features/cruda/pages/CatalogoPage';
import { AnaliticaPage as CrudaAnaliticaPage } from '@/features/cruda/pages/AnaliticaPage';
import { CreativosPage } from '@/features/creativos/pages/CreativosPage';
import { ClientesPage } from '@/features/crm/pages/ClientesPage';
import { PipelinePage } from '@/features/crm/pages/PipelinePage';
import { CrecimientoPage } from '@/features/crm/pages/CrecimientoPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/conceptone" element={<ConceptOneShell />}>
        <Route index element={<BookingDashboardPage />} />
        <Route path="shows" element={<ShowsPage />} />
        <Route path="logistica" element={<LogisticsPage />} />
        <Route path="artistas" element={<ArtistsPage />} />
        <Route path="analitica" element={<AnalyticsPage />} />
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
        <Route path="artistas" element={<ArtistasPage />} />
        <Route path="analitica" element={<AnaliticaPage />} />
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
      </Route>
      <Route path="/configuracion" element={<ConfigShell />} />
      <Route path="/mi-trabajo" element={<MiTrabajoShell />} />
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
      <Route path="/herramientas" element={<HerramientasShell />} />
    </Routes>
  );
}
