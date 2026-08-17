import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useProject, saveProject } from '../hooks/useProjects';
import { findStageDefinition } from '../construction/stages';
import { SafetyNotice } from '../components/ui/SafetyNotice';
import { findVideo } from '../videos/catalog';
import type { ChecklistItem, LaborMode } from '../domain/types';
import { stageLaborCostSafe, stageMaterialsCost } from '../budget/computeProjectBudget';
import { usePriceOverridesMap } from '../hooks/usePriceOverrides';
import { formatCurrency } from '../utils/format';

const LABOR_MODES: LaborMode[] = ['diy', 'daily', 'contract', 'mixed'];

export default function StageDetailPage() {
  const { t } = useTranslation();
  const { id, stageId } = useParams<{ id: string; stageId: string }>();
  const project = useProject(id);
  const priceOverrides = usePriceOverridesMap();

  const def = stageId ? findStageDefinition(stageId) : undefined;
  const stage = project?.stages.find((s) => s.stageDefId === stageId);

  if (!def) {
    return <p>{t('common.empty.noResults')}</p>;
  }

  if (!project || !stage) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t(def.nameKey)}</h1>
        <p className="text-slate-500">{t('common.empty.noProjects')}</p>
        <Link to="/project/new" className="btn-primary">
          {t('nav.newProject')}
        </Link>
      </div>
    );
  }

  async function updateStage(patch: Partial<typeof stage>) {
    const nextStages = project!.stages.map((s) =>
      s.id === stage!.id ? { ...s, ...patch } : s,
    );
    await saveProject({
      ...project!,
      stages: nextStages,
      updatedAt: new Date().toISOString(),
    });
  }

  function toggleChecklistItem(itemId: string) {
    const nextChecklist: ChecklistItem[] = stage!.checklist.map((c) =>
      c.id === itemId ? { ...c, done: !c.done } : c,
    );
    void updateStage({ checklist: nextChecklist });
  }

  function setStatus(status: typeof stage.status) {
    void updateStage({ status });
  }

  function setLaborMode(mode: LaborMode) {
    void updateStage({ laborMode: mode });
  }

  const materialsCost = stageMaterialsCost(stage, {
    ...priceOverrides,
    ...project.priceOverrides,
  });
  const laborCost = stageLaborCostSafe(stage);
  const videos = def.relatedVideoIds.map(findVideo).filter(Boolean);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t(def.categoryKey)}</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t(def.nameKey)}
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{t(def.objectiveKey)}</p>
      </header>

      <SafetyNotice level={def.requiresProfessional} />
      {!def.contentComplete ? (
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {t('stages.contentPartialNotice')}
        </p>
      ) : null}

      <section className="card space-y-3">
        <div className="flex flex-wrap gap-2">
          {(['not_started', 'in_progress', 'done'] as const).map((s) => (
            <button
              key={s}
              className={stage.status === s ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setStatus(s)}
            >
              {t(`stages.status.${s}`)}
            </button>
          ))}
        </div>
      </section>

      <Section title={t('stages.stepsTitle')}>
        <ol className="list-decimal space-y-2 pl-5">
          {def.stepKeys.map((key) => (
            <li key={key} className="text-slate-700 dark:text-slate-300">
              {t(key)}
            </li>
          ))}
        </ol>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Section title={t('stages.toolsTitle')}>
          <ToolList
            title={t('stages.toolsEssential')}
            items={def.tools.essentialKeys}
            t={t}
          />
          <ToolList
            title={t('stages.toolsOptional')}
            items={def.tools.optionalKeys}
            t={t}
          />
          <ToolList title={t('stages.toolsSafety')} items={def.tools.safetyKeys} t={t} />
        </Section>

        <Section title={t('stages.mistakesTitle')}>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {def.commonMistakeKeys.map((k) => (
              <li key={k}>{t(k)}</li>
            ))}
          </ul>
          <p className="mb-1 mt-3 text-sm font-semibold text-slate-900 dark:text-white">
            {t('stages.tipsTitle')}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {def.tipKeys.map((k) => (
              <li key={k}>{t(k)}</li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title={t('stages.checklistTitle')}>
        <ul className="space-y-2">
          {stage.checklist.map((item) => (
            <li key={item.id}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded"
                  checked={item.done}
                  onChange={() => toggleChecklistItem(item.id)}
                />
                <span
                  className={
                    item.done
                      ? 'text-slate-400 line-through'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                >
                  {t(item.labelKey)}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t('budget.labor.mode')}>
        <div className="flex flex-wrap gap-2">
          {LABOR_MODES.map((mode) => (
            <button
              key={mode}
              className={stage.laborMode === mode ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setLaborMode(mode)}
            >
              {t(`budget.labor.${mode}`)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {t('budget.summary.materials')}:{' '}
          <strong>{formatCurrency(materialsCost)}</strong> · {t('budget.summary.labor')}:{' '}
          <strong>{formatCurrency(laborCost)}</strong>
        </p>
      </Section>

      {videos.length > 0 ? (
        <Section title={t('nav.videos')}>
          <ul className="space-y-2">
            {videos.map((v) => (
              <li key={v!.id}>
                <a
                  className="text-brand-600 hover:underline dark:text-brand-400"
                  href={v!.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ {v!.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card space-y-2">
      <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

function ToolList({
  title,
  items,
  t,
}: {
  title: string;
  items: string[];
  t: (key: string) => string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-2">
      <p className="text-xs uppercase text-slate-400">{title}</p>
      <ul className="flex flex-wrap gap-1">
        {items.map((k) => (
          <li
            key={k}
            className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {t(k)}
          </li>
        ))}
      </ul>
    </div>
  );
}
