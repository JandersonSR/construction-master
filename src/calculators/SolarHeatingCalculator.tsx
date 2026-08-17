import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculateSolarHeatingSystem } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';
import { SafetyNotice } from '../components/ui/SafetyNotice';

const DEFAULT_LITERS_PER_PERSON = 60;
const DEFAULT_COLLECTOR_AREA_M2 = 1.5;

export function SolarHeatingCalculator() {
  const { t } = useTranslation();
  const [occupants, setOccupants] = useState<number | ''>('');
  const [collectorAreaM2PerUnit, setCollectorAreaM2PerUnit] = useState<number | ''>(
    DEFAULT_COLLECTOR_AREA_M2,
  );
  const [litersPerPerson, setLitersPerPerson] = useState<number | ''>(
    DEFAULT_LITERS_PER_PERSON,
  );

  const { result, error } = useMemo(() => {
    try {
      if (occupants === '' || collectorAreaM2PerUnit === '' || litersPerPerson === '') {
        return { result: null, error: undefined };
      }
      const r = calculateSolarHeatingSystem(
        occupants,
        collectorAreaM2PerUnit,
        litersPerPerson,
      );
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [occupants, collectorAreaM2PerUnit, litersPerPerson, t]);

  return (
    <>
      <CalculatorCard
        title={t('calculators.solarHeating.title')}
        error={error}
        result={
          result ? (
            <>
              <ResultRow
                label={t('calculators.solarHeating.resultReservoir')}
                value={formatQuantity(result.reservoirLiters, t('common.units.L'), 0)}
              />
              <ResultRow
                label={t('calculators.solarHeating.resultCollectors')}
                value={formatQuantity(result.collectorsCount, t('common.units.unit'), 0)}
              />
              <ResultRow
                label={t('calculators.solarHeating.resultCollectorArea')}
                value={formatQuantity(result.collectorAreaM2, t('common.units.m2'))}
              />
            </>
          ) : undefined
        }
      >
        <NumberField
          label={t('calculators.solarHeating.occupants')}
          value={occupants}
          onChange={setOccupants}
          step={1}
        />
        <NumberField
          label={t('calculators.solarHeating.collectorAreaM2PerUnit')}
          value={collectorAreaM2PerUnit}
          onChange={setCollectorAreaM2PerUnit}
        />
        <NumberField
          label={t('calculators.solarHeating.litersPerPerson')}
          value={litersPerPerson}
          onChange={setLitersPerPerson}
        />
      </CalculatorCard>
      <SafetyNotice level="recommended" />
    </>
  );
}
