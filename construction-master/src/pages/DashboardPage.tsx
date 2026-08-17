import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useActiveProject } from '../hooks/useActiveProject';
import { usePriceOverridesMap } from '../hooks/usePriceOverrides';
import { computeProjectBudget, computeActualCost } from '../budget/computeProjectBudget';
import { formatCurrency, formatPercent } from '../utils/format';
import { findStageDefinition } from '../construction/stages';
import { ProgressBar } from '../components/ui/ProgressBar';

const cards = [
  { to: '/project/new', key: 'newProject', icon: '➕' },
  { to: '/project', key: 'continueProject', icon: '🏗️' },
  { to: '/budget', key: 'budget', icon: '💰' },
  { to: '/calculators', key: 'calculators', icon: '🧮' },
  { to: '/materials', key: 'materials', icon: '🧱' },
  { to: '/guide', key: 'guide', icon: '📘' },
  { to: '/videos', key: 'videos', icon: '🎬' },
  { to: '/compare-methods', key: 'compareMethods', icon: '⚖️' },
  { to: '/progress', key: 'progress', icon: '📈' },
] as const;

export default function DashboardPage() {
  const { t } = useTranslation();
  const { project, loading } = useActiveProject();
  const priceOverrides = usePriceOverridesMap();

  const budget = project ? computeProjectBudget(project, priceOverrides) : undefined;
  const actualCost = project ? computeActualCost(project) : 0;

  const doneCount = project?.stages.filter((s) => s.status === 'done').length ?? 0;
  const totalStages = project?.stages.length ?? 0;
  const physicalProgress = totalStages > 0 ? (doneCount / totalStages) * 100 : 0;

  const nextStage = project?.stages.find((s) => s.status !== 'done');
  const nextStageDef = nextStage ? findStageDefinition(nextStage.stageDefId) : undefined;

  const pendingMaterials =
    project?.stages.reduce(
      (sum, s) => sum + s.materials.filter((m) => !m.purchased).length,
      0,
    ) ?? 0;

  const professionalRequiredPending =
    project?.stages.filter((s) => {
      const def = findStageDefinition(s.stageDefId);
      return s.status !== 'done' && def?.requiresProfessional === 'required';
    }).length ?? 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('dashboard.title')}
        </h1>
        {project ? (
          <p className="text-slate-500 dark:text-slate-400">{project.name}</p>
        ) : null}
      </header>

      {!loading && project && budget ? (
        <section className="card space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat
              label={t('dashboard.summary.estimatedCost')}
              value={formatCurrency(budget.total)}
            />
            <Stat
              label={t('dashboard.summary.actualCost')}
              value={formatCurrency(actualCost)}
            />
            <Stat
              label={t('dashboard.summary.progress')}
              value={formatPercent(physicalProgress)}
            />
            <Stat
              label={t('dashboard.summary.pendingMaterials')}
              value={
                pendingMaterials > 0
                  ? String(pendingMaterials)
                  : t('dashboard.summary.noPendingMaterials')
              }
            />
          </div>
          <ProgressBar
            percent={physicalProgress}
            label={t('progress.physicalProgress')}
          />
          {nextStageDef ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('dashboard.summary.nextStage')}:{' '}
              <Link
                to={`/project/${project.id}/stage/${nextStageDef.id}`}
                className="font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                {t(nextStageDef.nameKey)}
              </Link>
            </p>
          ) : null}
          {professionalRequiredPending > 0 ? (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              {t('dashboard.alerts.professionalRequired', {
                count: professionalRequiredPending,
              })}
            </div>
          ) : null}
        </section>
      ) : !loading ? (
        <section className="card">
          <p className="mb-3 text-slate-600 dark:text-slate-300">
            {t('common.empty.noProjects')}
          </p>
          <Link to="/project/new" className="btn-primary">
            {t('nav.newProject')}
          </Link>
        </section>
      ) : null}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card flex flex-col gap-1 hover:shadow-md">
            <span className="text-2xl" aria-hidden="true">
              {c.icon}
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {t(`dashboard.cards.${c.key}.title`)}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t(`dashboard.cards.${c.key}.description`)}
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
