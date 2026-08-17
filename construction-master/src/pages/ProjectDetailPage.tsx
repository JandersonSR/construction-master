import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useProject, saveProject } from '../hooks/useProjects';
import { usePriceOverridesMap } from '../hooks/usePriceOverrides';
import { computeProjectBudget } from '../budget/computeProjectBudget';
import { getOrderedStageDefinitions } from '../construction/stages';
import { formatCurrency } from '../utils/format';
import { duplicateAsScenario } from '../projects/createProject';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
};

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const project = useProject(id);
  const priceOverrides = usePriceOverridesMap();

  if (!project) {
    return <p className="text-slate-500">…</p>;
  }

  const budget = computeProjectBudget(project, priceOverrides);
  const stageDefs = getOrderedStageDefinitions();

  async function handleDuplicate() {
    const name = window.prompt(
      t('project.detail.createScenario'),
      `${project!.name} (2)`,
    );
    if (!name) return;
    const scenario = duplicateAsScenario(project!, name);
    await saveProject(scenario);
    navigate(`/project/${scenario.id}`);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {project.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {project.location} · {project.dimensions.area ?? '—'} m²
          </p>
          {project.scenarioOf ? (
            <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">
              {t('project.detail.scenarioOfNotice', { name: project.scenarioOf })}
            </p>
          ) : null}
        </div>
        <button className="btn-secondary shrink-0" onClick={handleDuplicate}>
          {t('project.detail.createScenario')}
        </button>
      </header>

      <section className="card grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat
          label={t('budget.summary.materials')}
          value={formatCurrency(budget.materialsCost)}
        />
        <Stat
          label={t('budget.summary.labor')}
          value={formatCurrency(budget.laborCost)}
        />
        <Stat label={t('budget.summary.total')} value={formatCurrency(budget.total)} />
        <Stat
          label={t('budget.summary.costPerM2')}
          value={formatCurrency(budget.costPerSquareMeter)}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          {t('nav.guide')}
        </h2>
        <ul className="space-y-2">
          {stageDefs.map((def) => {
            const stage = project.stages.find((s) => s.stageDefId === def.id);
            return (
              <li key={def.id}>
                <Link
                  to={`/project/${project.id}/stage/${def.id}`}
                  className="card flex items-center justify-between gap-3 hover:shadow-md"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {def.order}. {t(def.nameKey)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t(def.categoryKey)}
                    </p>
                  </div>
                  <span
                    className={`badge ${STATUS_COLORS[stage?.status ?? 'not_started']}`}
                  >
                    {t(`stages.status.${stage?.status ?? 'not_started'}`)}
                  </span>
                </Link>
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
