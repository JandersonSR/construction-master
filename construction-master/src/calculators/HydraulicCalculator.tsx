import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculateHydraulicRoughEstimate } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';
import { SafetyNotice } from '../components/ui/SafetyNotice';

const DEFAULT_METERS_PER_POINT = 3;
const DEFAULT_CONNECTIONS_PER_POINT = 4;

export function HydraulicCalculator() {
  const { t } = useTranslation();
  const [points, setPoints] = useState<number | ''>('');
  const [metersPerPoint, setMetersPerPoint] = useState<number | ''>(
    DEFAULT_METERS_PER_POINT,
  );
  const [connectionsPerPoint, setConnectionsPerPoint] = useState<number | ''>(
    DEFAULT_CONNECTIONS_PER_POINT,
  );

  const { result, error } = useMemo(() => {
    try {
      if (points === '' || metersPerPoint === '' || connectionsPerPoint === '') {
        return { result: null, error: undefined };
      }
      const r = calculateHydraulicRoughEstimate(
        points,
        metersPerPoint,
        connectionsPerPoint,
      );
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [points, metersPerPoint, connectionsPerPoint, t]);

  return (
    <>
      <CalculatorCard
        title={t('calculators.hydraulic.title')}
        error={error}
        result={
          result ? (
            <>
              <ResultRow
                label={t('calculators.hydraulic.resultPipeMeters')}
                value={formatQuantity(result.pipeMetersEstimate, t('common.units.m'))}
              />
              <ResultRow
                label={t('calculators.hydraulic.resultConnections')}
                value={formatQuantity(
                  result.connectionsEstimate,
                  t('common.units.unit'),
                  0,
                )}
              />
            </>
          ) : undefined
        }
      >
        <NumberField
          label={t('calculators.hydraulic.points')}
          value={points}
          onChange={setPoints}
          step={1}
        />
        <NumberField
          label={t('calculators.hydraulic.metersPerPoint')}
          value={metersPerPoint}
          onChange={setMetersPerPoint}
        />
        <NumberField
          label={t('calculators.hydraulic.connectionsPerPoint')}
          value={connectionsPerPoint}
          onChange={setConnectionsPerPoint}
        />
      </CalculatorCard>
      <SafetyNotice level="recommended" />
    </>
  );
}
