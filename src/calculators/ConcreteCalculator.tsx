import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculateConcreteMaterials, DEFAULT_CONCRETE_TRACE } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';

export function ConcreteCalculator() {
  const { t } = useTranslation();
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');

  const { result, error } = useMemo(() => {
    try {
      if (length === '' || width === '' || height === '')
        return { result: null, error: undefined };
      const r = calculateConcreteMaterials(length, width, height, DEFAULT_CONCRETE_TRACE);
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [length, width, height, t]);

  return (
    <CalculatorCard
      title={t('calculators.concrete.title')}
      error={error}
      result={
        result ? (
          <>
            <p className="mb-1 text-xs text-slate-500">
              {t('calculators.concrete.trace')}: {result.trace}
            </p>
            <ResultRow
              label={t('calculators.concrete.resultCementBags')}
              value={formatQuantity(result.cementBags, t('common.units.bag'), 1)}
            />
            <ResultRow
              label={t('calculators.concrete.resultSand')}
              value={formatQuantity(result.sandM3, t('common.units.m3'))}
            />
            <ResultRow
              label={t('calculators.concrete.resultGravel')}
              value={formatQuantity(result.gravelM3, t('common.units.m3'))}
            />
            <ResultRow
              label={t('calculators.concrete.resultWater')}
              value={formatQuantity(result.waterL, t('common.units.L'), 0)}
            />
          </>
        ) : undefined
      }
    >
      <NumberField
        label={t('calculators.geometry.length')}
        value={length}
        onChange={setLength}
      />
      <NumberField
        label={t('calculators.geometry.width')}
        value={width}
        onChange={setWidth}
      />
      <NumberField
        label={t('calculators.geometry.height')}
        value={height}
        onChange={setHeight}
      />
    </CalculatorCard>
  );
}
