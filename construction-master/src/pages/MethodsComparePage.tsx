import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { constructionMethods } from '../construction/methods';
import { calculateMethodCost } from '../domain/calc';
import { NumberField } from '../components/ui/NumberField';
import { formatCurrency, formatPercent } from '../utils/format';

const DEFAULT_BASE_COST = 1800;

export default function MethodsComparePage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([
    'conventional-masonry',
    'steel-frame',
  ]);
  const [baseCost, setBaseCost] = useState<number | ''>(DEFAULT_BASE_COST);
  const [area, setArea] = useState<number | ''>(120);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((m) => m !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const rows = useMemo(() => {
    if (baseCost === '' || area === '') return [];
    return selected
      .map((id) => constructionMethods.find((m) => m.id === id))
      .filter((m): m is (typeof constructionMethods)[number] => Boolean(m))
      .map((method) => ({
        method,
        total: calculateMethodCost(method, baseCost, area),
      }));
  }, [selected, baseCost, area]);

  const cheapest = rows.length > 0 ? Math.min(...rows.map((r) => r.total)) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('methods.compare.title')}
      </h1>

      <section className="card space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label={t('methods.compare.baseCost')}
            value={baseCost}
            onChange={setBaseCost}
          />
          <NumberField
            label={t('methods.compare.area')}
            value={area}
            onChange={setArea}
          />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('methods.compare.selectMethods')}
        </p>
        <div className="flex flex-wrap gap-2">
          {constructionMethods.map((m) => (
            <button
              key={m.id}
              className={selected.includes(m.id) ? 'btn-primary' : 'btn-secondary'}
              onClick={() => toggle(m.id)}
            >
              {t(m.nameKey)}
            </button>
          ))}
        </div>
      </section>

      {rows.length > 0 ? (
        <section className="overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-2 pr-3">{t('project.wizard.method.title')}</th>
                <th className="py-2 pr-3">{t('methods.compare.totalCost')}</th>
                <th className="py-2 pr-3">{t('methods.compare.costPerSquareMeter')}</th>
                <th className="py-2 pr-3">{t('methods.compare.difference')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ method, total }) => (
                <tr
                  key={method.id}
                  className="border-b border-slate-100 dark:border-slate-900"
                >
                  <td className="py-2 pr-3 font-medium text-slate-900 dark:text-white">
                    {t(method.nameKey)}
                  </td>
                  <td className="py-2 pr-3">{formatCurrency(total)}</td>
                  <td className="py-2 pr-3">{formatCurrency(total / Number(area))}</td>
                  <td className="py-2 pr-3">
                    {total === cheapest
                      ? '—'
                      : formatPercent(((total - cheapest) / cheapest) * 100, 1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {t('methods.compare.disclaimer')}
          </p>
        </section>
      ) : null}
    </div>
  );
}
