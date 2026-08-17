import { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { AppShell } from '../components/layout/AppShell';
import { AppRoutes } from './routes';
import { useTheme } from '../hooks/useTheme';
import { useSeedDemoProject } from '../hooks/useSeedDemoProject';

function LoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="animate-pulse text-slate-400">…</span>
    </div>
  );
}

export default function App() {
  // Aplica o tema salvo (claro/escuro/automático) assim que o app monta.
  useTheme();
  // Na primeira execução, semeia a obra de demonstração "Chácara — Casa 250m²".
  useSeedDemoProject();

  return (
    <ErrorBoundary>
      {/*
        HashRouter é usado (em vez de BrowserRouter) porque o app é
        hospedado como build estático (ex.: GitHub Pages) sem servidor para
        reescrever rotas — hash routing funciona em qualquer hospedagem
        estática sem configuração adicional.
      */}
      <HashRouter>
        <AppShell>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </AppShell>
      </HashRouter>
    </ErrorBoundary>
  );
}
