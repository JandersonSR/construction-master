import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculateElectricalRoughEstimate } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';
import { SafetyNotice } from '../components/ui/SafetyNotice';

const DEFAULT_OUTLETS_PER_ROOM = 4;

export function ElectricalCalculator() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<number | ''>('');
  const [outletsPerRoom, setOutletsPerRoom] = useState<number | ''>(
    DEFAULT_OUTLETS_PER_ROOM,
  );

  const { result, error } = useMemo(() => {
    try {
      if (rooms === '' || outletsPerRoom === '')
        return { result: null, error: undefined };
      const r = calculateElectricalRoughEstimate(rooms, outletsPerRoom);
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [rooms, outletsPerRoom, t]);

  return (
    <>
      <CalculatorCard
        title={t('calculators.electrical.title')}
        error={error}
        result={
          result ? (
            <>
              <ResultRow
                label={t('calculators.electrical.resultOutlets')}
                value={formatQuantity(result.outletsEstimate, t('common.units.unit'), 0)}
              />
              <ResultRow
                label={t('calculators.electrical.resultSwitches')}
                value={formatQuantity(result.switchesEstimate, t('common.units.unit'), 0)}
              />
              <ResultRow
                label={t('calculators.electrical.resultCableMeters')}
                value={formatQuantity(result.cableMetersEstimate, t('common.units.m'))}
              />
              <ResultRow
                label={t('calculators.electrical.resultCircuits')}
                value={formatQuantity(result.circuitsEstimate, t('common.units.unit'), 0)}
              />
            </>
          ) : undefined
        }
      >
        <NumberField
          label={t('calculators.electrical.rooms')}
          value={rooms}
          onChange={setRooms}
          step={1}
        />
        <NumberField
          label={t('calculators.electrical.outletsPerRoom')}
          value={outletsPerRoom}
          onChange={setOutletsPerRoom}
          step={1}
        />
      </CalculatorCard>
      <SafetyNotice level="required" />
    </>
  );
}
