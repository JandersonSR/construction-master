import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProjectHomePage = lazy(() => import('../pages/ProjectHomePage'));
const NewProjectWizardPage = lazy(() => import('../pages/NewProjectWizardPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const StageDetailPage = lazy(() => import('../pages/StageDetailPage'));
const CalculatorsHubPage = lazy(() => import('../pages/CalculatorsHubPage'));
const MaterialsPage = lazy(() => import('../pages/MaterialsPage'));
const BudgetPage = lazy(() => import('../pages/BudgetPage'));
const GuideIndexPage = lazy(() => import('../pages/GuideIndexPage'));
const VideosPage = lazy(() => import('../pages/VideosPage'));
const MethodsComparePage = lazy(() => import('../pages/MethodsComparePage'));
const ProgressPage = lazy(() => import('../pages/ProgressPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const MorePage = lazy(() => import('../pages/MorePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/project" element={<ProjectHomePage />} />
      <Route path="/project/new" element={<NewProjectWizardPage />} />
      <Route path="/project/:id" element={<ProjectDetailPage />} />
      <Route path="/project/:id/stage/:stageId" element={<StageDetailPage />} />
      <Route path="/calculators" element={<CalculatorsHubPage />} />
      <Route path="/materials" element={<MaterialsPage />} />
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/guide" element={<GuideIndexPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/compare-methods" element={<MethodsComparePage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/more" element={<MorePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
