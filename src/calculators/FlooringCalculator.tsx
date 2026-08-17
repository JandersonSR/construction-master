import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import {
  calculateFlooringMaterials,
  DEFAULT_WASTE_PERCENT_FLOORING,
} from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';

export function FlooringCalculator() {
  const { t } = useTranslation();
  const [area, setArea] = useState<number | ''>('');
  const [boxCoverage, setBoxCoverage] = useState<number | ''>(2);
  const [mortarPerM2, setMortarPerM2] = useState<number | ''>(4);
  const [groutPerM2, setGroutPerM2] = useState<number | ''>(0.5);
  const [waste, setWaste] = useState<number | ''>(DEFAULT_WASTE_PERCENT_FLOORING);

  const { result, error } = useMemo(() => {
    try {
      if (area === '' || boxCoverage === '') return { result: null, error: undefined };
      const r = calculateFlooringMaterials(
        area,
        boxCoverage,
        mortarPerM2 === '' ? 0 : mortarPerM2,
        groutPerM2 === '' ? 0 : groutPerM2,
        waste === '' ? 0 : waste,
      );
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [area, boxCoverage, mortarPerM2, groutPerM2, waste, t]);

  return (
    <CalculatorCard
      title={t('calculators.flooring.title')}
      error={error}
      result={
        result ? (
          <>
            <ResultRow
              label={t('calculators.flooring.resultBoxes')}
              value={formatQuantity(result.boxes, t('common.units.box'), 0)}
            />
            <p className="text-xs text-slate-500">
              {t('calculators.flooring.resultRoundedUpNotice')}
            </p>
            <ResultRow
              label={t('calculators.masonry.resultMortar')}
              value={formatQuantity(result.mortarKg, t('common.units.kg'))}
            />
          </>
        ) : undefined
      }
    >
      <NumberField
        label={t('calculators.geometry.resultArea')}
        value={area}
        onChange={setArea}
      />
      <NumberField
        label={t('calculators.flooring.boxCoverage')}
        value={boxCoverage}
        onChange={setBoxCoverage}
      />
      <NumberField
        label={t('calculators.flooring.mortarPerM2')}
        value={mortarPerM2}
        onChange={setMortarPerM2}
      />
      <NumberField
        label={t('calculators.flooring.groutPerM2')}
        value={groutPerM2}
        onChange={setGroutPerM2}
      />
      <NumberField
        label={t('calculators.masonry.wastePercent')}
        value={waste}
        onChange={setWaste}
        step={1}
      />
    </CalculatorCard>
  );
}
