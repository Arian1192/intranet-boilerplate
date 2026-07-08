import { Routes, Route } from 'react-router';
import { LoginPage } from '@/features/auth/LoginPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ConceptOneShell } from '@/features/modules/ConceptOneShell';
import { EtraShell } from '@/features/modules/EtraShell';
import { ProduccionShell } from '@/features/modules/ProduccionShell';
import { CrudaShell } from '@/features/modules/CrudaShell';
import { CRMShell } from '@/features/modules/CRMShell';
import { TeamShell } from '@/features/modules/TeamShell';
import { ConfigShell } from '@/features/modules/ConfigShell';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/conceptone" element={<ConceptOneShell />} />
      <Route path="/etra" element={<EtraShell />} />
      <Route path="/produccion" element={<ProduccionShell />} />
      <Route path="/cruda" element={<CrudaShell />} />
      <Route path="/crm" element={<CRMShell />} />
      <Route path="/personal" element={<TeamShell />} />
      <Route path="/configuracion" element={<ConfigShell />} />
    </Routes>
  );
}
