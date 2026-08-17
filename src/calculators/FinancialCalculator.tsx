import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import {
  calculateProjectBudget,
  DEFAULT_CONTINGENCY_PERCENT,
  simulateDiySavings,
} from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatCurrency, formatPercent } from '../utils/format';

export function FinancialCalculator() {
  const { t } = useTranslation();
  const [materialsCost, setMaterialsCost] = useState<number | ''>('');
  const [laborCost, setLaborCost] = useState<number | ''>('');
  const [toolsCost, setToolsCost] = useState<number | ''>(0);
  const [otherCost, setOtherCost] = useState<number | ''>(0);
  const [contingency, setContingency] = useState<number | ''>(
    DEFAULT_CONTINGENCY_PERCENT,
  );
  const [area, setArea] = useState<number | ''>('');

  const { result, error } = useMemo(() => {
    try {
      if (materialsCost === '' || laborCost === '' || area === '') {
        return { result: null, error: undefined };
      }
      const r = calculateProjectBudget({
        stages: [{ stageDefId: 'custom', materialsCost, laborCost }],
        toolsCost: toolsCost === '' ? 0 : toolsCost,
        otherCost: otherCost === '' ? 0 : otherCost,
        contingencyPercent: contingency === '' ? 0 : contingency,
        areaM2: area,
      });
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [materialsCost, laborCost, toolsCost, otherCost, contingency, area, t]);

  const [professionalCost, setProfessionalCost] = useState<number | ''>('');
  const [diyCost, setDiyCost] = useState<number | ''>('');
  const diyResult = useMemo(() => {
    if (professionalCost === '' || diyCost === '') return null;
    try {
      return simulateDiySavings(professionalCost, diyCost);
    } catch {
      return null;
    }
  }, [professionalCost, diyCost]);

  return (
    <>
      <CalculatorCard
        title={t('calculators.financial.title')}
        error={error}
        result={
          result ? (
            <>
              <ResultRow
                label={t('calculators.financial.resultTotal')}
                value={formatCurrency(result.total)}
              />
              <ResultRow
                label={t('calculators.financial.resultCostPerM2')}
                value={formatCurrency(result.costPerSquareMeter)}
              />
              <ResultRow
                label={t('budget.summary.contingency')}
                value={formatCurrency(result.contingency)}
              />
            </>
          ) : undefined
        }
      >
        <NumberField
          label={t('calculators.financial.materialsCost')}
          value={materialsCost}
          onChange={setMaterialsCost}
        />
        <NumberField
          label={t('calculators.financial.laborCost')}
          value={laborCost}
          onChange={setLaborCost}
        />
        <NumberField
          label={t('calculators.financial.toolsCost')}
          value={toolsCost}
          onChange={setToolsCost}
        />
        <NumberField
          label={t('calculators.financial.otherCost')}
          value={otherCost}
          onChange={setOtherCost}
        />
        <NumberField
          label={t('calculators.financial.contingencyPercent')}
          value={contingency}
          onChange={setContingency}
          step={1}
        />
        <NumberField
          label={t('calculators.financial.area')}
          value={area}
          onChange={setArea}
        />
      </CalculatorCard>

      <CalculatorCard
        title={t('calculators.financial.diySimulator')}
        result={
          diyResult ? (
            <>
              <ResultRow
                label={t('calculators.financial.resultSavings')}
                value={formatCurrency(diyResult.savings)}
              />
              <ResultRow
                label={t('calculators.financial.resultSavingsPercent')}
                value={formatPercent(diyResult.savingsPercent, 1)}
              />
            </>
          ) : undefined
        }
      >
        <NumberField
          label={t('calculators.financial.professionalCost')}
          value={professionalCost}
          onChange={setProfessionalCost}
        />
        <NumberField
          label={t('calculators.financial.diyCost')}
          value={diyCost}
          onChange={setDiyCost}
        />
      </CalculatorCard>
    </>
  );
}
