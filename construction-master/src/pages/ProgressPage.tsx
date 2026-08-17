import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useActiveProject } from '../hooks/useActiveProject';
import { usePriceOverridesMap } from '../hooks/usePriceOverrides';
import { computeProjectBudget, computeActualCost } from '../budget/computeProjectBudget';
import { findStageDefinition } from '../construction/stages';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatCurrency } from '../utils/format';
import { EmptyState } from '../components/ui/EmptyState';

export default function ProgressPage() {
  const { t } = useTranslation();
  const { project, loading } = useActiveProject();
  const priceOverrides = usePriceOverridesMap();

  if (loading) return null;
  if (!project) {
    return (
      <EmptyState
        title={t('common.empty.noProjects')}
        action={
          <Link to="/project/new" className="btn-primary">
            {t('nav.newProject')}
          </Link>
        }
      />
    );
  }

  const budget = computeProjectBudget(project, priceOverrides);
  const actual = computeActualCost(project);
  const done = project.stages.filter((s) => s.status === 'done').length;
  const physicalProgress =
    project.stages.length > 0 ? (done / project.stages.length) * 100 : 0;
  const financialProgress = budget.total > 0 ? (actual / budget.total) * 100 : 0;
  const diff = budget.total - actual;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('progress.title')}
      </h1>

      <section className="card space-y-4">
        <ProgressBar percent={physicalProgress} label={t('progress.physicalProgress')} />
        <ProgressBar
          percent={financialProgress}
          label={t('progress.financialProgress')}
          colorClassName={financialProgress > 100 ? 'bg-red-500' : 'bg-emerald-500'}
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label={t('progress.stagesCompleted')} value={String(done)} />
          <Stat
            label={t('progress.stagesRemaining')}
            value={String(project.stages.length - done)}
          />
          <Stat
            label={t('progress.plannedBudget')}
            value={formatCurrency(budget.total)}
          />
          <Stat label={t('progress.actualSpend')} value={formatCurrency(actual)} />
        </div>
        <p
          className={`text-sm font-medium ${diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
        >
          {t('progress.difference')}: {formatCurrency(diff)} (
          {diff >= 0 ? t('progress.underBudget') : t('progress.overBudget')})
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          {t('progress.chartByStage')}
        </h2>
        <ul className="space-y-2">
          {project.stages.map((stage) => {
            const def = findStageDefinition(stage.stageDefId);
            const percent =
              stage.status === 'done' ? 100 : stage.status === 'in_progress' ? 50 : 0;
            return (
              <li key={stage.id} className="card">
                <ProgressBar
                  percent={percent}
                  label={def ? t(def.nameKey) : stage.stageDefId}
                />
              </li>
            );
          })}
        </ul>
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
