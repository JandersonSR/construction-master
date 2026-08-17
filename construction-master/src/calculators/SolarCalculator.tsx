import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import {
  calculateSolarSystem,
  DEFAULT_PEAK_SUN_HOURS,
  DEFAULT_PERFORMANCE_RATIO,
} from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';
import { SafetyNotice } from '../components/ui/SafetyNotice';

export function SolarCalculator() {
  const { t } = useTranslation();
  const [consumption, setConsumption] = useState<number | ''>('');
  const [panelWattage, setPanelWattage] = useState<number | ''>(550);
  const [panelArea, setPanelArea] = useState<number | ''>(2.6);
  const [systemCost, setSystemCost] = useState<number | ''>('');
  const [monthlySavings, setMonthlySavings] = useState<number | ''>('');
  const [peakSunHours, setPeakSunHours] = useState<number | ''>(DEFAULT_PEAK_SUN_HOURS);
  const [performanceRatio, setPerformanceRatio] = useState<number | ''>(
    DEFAULT_PERFORMANCE_RATIO,
  );

  const { result, error } = useMemo(() => {
    try {
      if (
        consumption === '' ||
        panelWattage === '' ||
        panelArea === '' ||
        systemCost === '' ||
        peakSunHours === '' ||
        performanceRatio === ''
      ) {
        return { result: null, error: undefined };
      }
      const r = calculateSolarSystem(
        consumption,
        panelWattage,
        panelArea,
        systemCost,
        monthlySavings === '' ? 0 : monthlySavings,
        peakSunHours,
        performanceRatio,
      );
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [
    consumption,
    panelWattage,
    panelArea,
    systemCost,
    monthlySavings,
    peakSunHours,
    performanceRatio,
    t,
  ]);

  return (
    <>
      <CalculatorCard
        title={t('calculators.solar.title')}
        error={error}
        result={
          result ? (
            <>
              <ResultRow
                label={t('calculators.solar.resultSystemSize')}
                value={`${result.systemSizeKwp.toFixed(2)} kWp`}
              />
              <ResultRow
                label={t('calculators.solar.resultPanels')}
                value={formatQuantity(result.panelsCount, t('common.units.unit'), 0)}
              />
              <ResultRow
                label={t('calculators.solar.resultArea')}
                value={formatQuantity(result.requiredAreaM2, t('common.units.m2'))}
              />
              <ResultRow
                label={t('calculators.solar.resultGeneration')}
                value={`${result.estimatedMonthlyGenerationKwh.toFixed(0)} kWh/mês`}
              />
              {result.paybackMonths !== null ? (
                <ResultRow
                  label={t('calculators.solar.resultPayback')}
                  value={`${result.paybackMonths.toFixed(0)} meses`}
                />
              ) : null}
            </>
          ) : undefined
        }
      >
        <NumberField
          label={t('calculators.solar.monthlyConsumption')}
          value={consumption}
          onChange={setConsumption}
        />
        <NumberField
          label={t('calculators.solar.panelWattage')}
          value={panelWattage}
          onChange={setPanelWattage}
        />
        <NumberField
          label={t('calculators.solar.panelArea')}
          value={panelArea}
          onChange={setPanelArea}
        />
        <NumberField
          label={t('calculators.solar.systemCost')}
          value={systemCost}
          onChange={setSystemCost}
        />
        <NumberField
          label={t('calculators.solar.monthlySavings')}
          value={monthlySavings}
          onChange={setMonthlySavings}
        />
        <NumberField
          label={t('calculators.solar.peakSunHours')}
          value={peakSunHours}
          onChange={setPeakSunHours}
        />
        <NumberField
          label={t('calculators.solar.performanceRatio')}
          value={performanceRatio}
          onChange={setPerformanceRatio}
          step={0.05}
        />
      </CalculatorCard>
      <SafetyNotice level="required" />
    </>
  );
}
