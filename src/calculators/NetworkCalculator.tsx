import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculateNetworkEstimate } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';

const DEFAULT_METERS_PER_POINT = 15;

export function NetworkCalculator() {
  const { t } = useTranslation();
  const [points, setPoints] = useState<number | ''>('');
  const [metersPerPoint, setMetersPerPoint] = useState<number | ''>(
    DEFAULT_METERS_PER_POINT,
  );

  const { result, error } = useMemo(() => {
    try {
      if (points === '' || metersPerPoint === '')
        return { result: null, error: undefined };
      const r = calculateNetworkEstimate(points, metersPerPoint);
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [points, metersPerPoint, t]);

  return (
    <CalculatorCard
      title={t('calculators.network.title')}
      error={error}
      result={
        result ? (
          <>
            <ResultRow
              label={t('calculators.network.resultCableMeters')}
              value={formatQuantity(result.cableMetersEstimate, t('common.units.m'))}
            />
            <ResultRow
              label={t('calculators.network.resultConnectors')}
              value={formatQuantity(result.connectorsEstimate, t('common.units.unit'), 0)}
            />
            <ResultRow
              label={t('calculators.network.resultPatchCords')}
              value={formatQuantity(result.patchCordsEstimate, t('common.units.unit'), 0)}
            />
          </>
        ) : undefined
      }
    >
      <NumberField
        label={t('calculators.network.points')}
        value={points}
        onChange={setPoints}
        step={1}
      />
      <NumberField
        label={t('calculators.network.metersPerPoint')}
        value={metersPerPoint}
        onChange={setMetersPerPoint}
      />
    </CalculatorCard>
  );
}
