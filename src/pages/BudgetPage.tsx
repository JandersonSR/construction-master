import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useActiveProject } from '../hooks/useActiveProject';
import {
  usePriceOverridesMap,
  setPriceOverride,
  removePriceOverride,
} from '../hooks/usePriceOverrides';
import { computeProjectBudget, computeActualCost } from '../budget/computeProjectBudget';
import { findStageDefinition } from '../construction/stages';
import { defaultPriceCatalog } from '../domain/pricing/catalog';
import { formatCurrency } from '../utils/format';
import { EmptyState } from '../components/ui/EmptyState';
import { useState } from 'react';

export default function BudgetPage() {
  const { t } = useTranslation();
  const { project, loading } = useActiveProject();
  const priceOverrides = usePriceOverridesMap();
  const [showPrices, setShowPrices] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('budget.title')}
        </h1>
        <button className="btn-secondary" onClick={() => window.print()}>
          {t('common.actions.print')}
        </button>
      </div>

      <section className="card grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat
          label={t('budget.summary.materials')}
          value={formatCurrency(budget.materialsCost)}
        />
        <Stat
          label={t('budget.summary.labor')}
          value={formatCurrency(budget.laborCost)}
        />
        <Stat
          label={t('budget.summary.contingency')}
          value={formatCurrency(budget.contingency)}
        />
        <Stat label={t('budget.summary.total')} value={formatCurrency(budget.total)} />
        <Stat
          label={t('budget.summary.costPerM2')}
          value={formatCurrency(budget.costPerSquareMeter)}
        />
        <Stat label={t('dashboard.summary.actualCost')} value={formatCurrency(actual)} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          {t('budget.byStage')}
        </h2>
        <ul className="space-y-2">
          {budget.byStage
            .filter((s) => s.total > 0)
            .map((s) => {
              const def = findStageDefinition(s.stageDefId);
              return (
                <li key={s.stageDefId} className="card flex items-center justify-between">
                  <span className="text-slate-800 dark:text-slate-200">
                    {def ? t(def.nameKey) : s.stageDefId}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(s.total)}
                  </span>
                </li>
              );
            })}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('budget.prices.title')}
          </h2>
          <button className="btn-ghost" onClick={() => setShowPrices((v) => !v)}>
            {showPrices ? t('common.actions.close') : t('common.actions.edit')}
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('common.priceDisclaimer')}
        </p>
        {showPrices ? (
          <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
            {defaultPriceCatalog.map((material) => {
              const override = priceOverrides[material.id];
              return (
                <li key={material.id} className="flex items-center gap-3 py-2">
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    {t(material.nameKey)}
                  </span>
                  <input
                    type="number"
                    className="input w-28"
                    defaultValue={override ?? material.defaultPrice}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isFinite(value) && value > 0) {
                        void setPriceOverride({
                          materialId: material.id,
                          price: value,
                          date: new Date().toISOString(),
                        });
                      }
                    }}
                  />
                  {override !== undefined ? (
                    <button
                      className="btn-ghost text-xs"
                      onClick={() => removePriceOverride(material.id)}
                    >
                      {t('budget.prices.restoreDefault')}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
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
