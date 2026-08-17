import { useTranslation } from 'react-i18next';
import { useActiveProject } from '../hooks/useActiveProject';
import { saveProject } from '../hooks/useProjects';
import { usePriceOverridesMap } from '../hooks/usePriceOverrides';
import { findMaterial, resolveMaterialPrice } from '../domain/pricing/catalog';
import { findStageDefinition } from '../construction/stages';
import { formatCurrency, formatQuantity } from '../utils/format';
import { EmptyState } from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import type { ProjectStage, StageMaterialLine } from '../domain/types';

export default function MaterialsPage() {
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

  const mergedOverrides = { ...priceOverrides, ...project.priceOverrides };

  async function togglePurchased(stageId: string, materialIndex: number) {
    const nextStages = project!.stages.map((s) => {
      if (s.id !== stageId) return s;
      const materials = s.materials.map((m, i) =>
        i === materialIndex ? { ...m, purchased: !m.purchased } : m,
      );
      return { ...s, materials };
    });
    await saveProject({
      ...project!,
      stages: nextStages,
      updatedAt: new Date().toISOString(),
    });
  }

  const lines = project.stages.flatMap((stage) =>
    stage.materials.map((line, index) => ({ stage, line, index })),
  );

  const pending = lines.filter((l) => !l.line.purchased);
  const purchased = lines.filter((l) => l.line.purchased);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('budget.materials.title')}
      </h1>

      {lines.length === 0 ? (
        <EmptyState title={t('common.empty.noResults')} />
      ) : (
        <>
          <MaterialGroup
            title={t('budget.materials.pending')}
            items={pending}
            overrides={mergedOverrides}
            onToggle={togglePurchased}
            t={t}
          />
          <MaterialGroup
            title={t('budget.materials.purchased')}
            items={purchased}
            overrides={mergedOverrides}
            onToggle={togglePurchased}
            t={t}
          />
        </>
      )}
    </div>
  );
}

interface LineEntry {
  stage: ProjectStage;
  line: StageMaterialLine;
  index: number;
}

function MaterialGroup({
  title,
  items,
  overrides,
  onToggle,
  t,
}: {
  title: string;
  items: LineEntry[];
  overrides: Record<string, number>;
  onToggle: (stageId: string, index: number) => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map(({ stage, line, index }) => {
          const material = findMaterial(line.materialId);
          const price = resolveMaterialPrice(line.materialId, overrides);
          const stageDef = findStageDefinition(stage.stageDefId);
          return (
            <li key={`${stage.id}-${index}`} className="card flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded"
                checked={line.purchased}
                onChange={() => onToggle(stage.id, index)}
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {material ? t(material.nameKey) : line.materialId}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stageDef ? t(stageDef.nameKey) : ''} ·{' '}
                  {formatQuantity(line.quantity, t(`common.units.${line.unit}`))}
                </p>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {formatCurrency(price * line.quantity)}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
