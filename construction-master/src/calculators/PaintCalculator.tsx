import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculatePaintLiters, DEFAULT_PAINT_COATS } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';
import { paintTypeCatalog } from '../domain/pricing/paints';

export function PaintCalculator() {
  const { t } = useTranslation();
  const [area, setArea] = useState<number | ''>('');
  const [paintId, setPaintId] = useState(paintTypeCatalog[0]!.id);
  const [coats, setCoats] = useState<number | ''>(DEFAULT_PAINT_COATS);

  const paint = paintTypeCatalog.find((p) => p.id === paintId)!;

  const { result, error } = useMemo(() => {
    try {
      if (area === '' || coats === '') return { result: null, error: undefined };
      const r = calculatePaintLiters(area, paint.yieldM2PerLiter, coats);
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [area, paint, coats, t]);

  return (
    <CalculatorCard
      title={t('calculators.paint.title')}
      error={error}
      result={
        result ? (
          <ResultRow
            label={t('calculators.paint.resultLiters')}
            value={formatQuantity(result.liters, t('common.units.L'), 1)}
          />
        ) : undefined
      }
    >
      <NumberField
        label={t('calculators.geometry.resultArea')}
        value={area}
        onChange={setArea}
      />
      <div>
        <label className="label">{t('calculators.paint.paintType')}</label>
        <select
          className="input"
          value={paintId}
          onChange={(e) => setPaintId(e.target.value)}
        >
          {paintTypeCatalog.map((p) => (
            <option key={p.id} value={p.id}>
              {t(p.nameKey)}
            </option>
          ))}
        </select>
      </div>
      <NumberField
        label={t('calculators.paint.coats')}
        value={coats}
        onChange={setCoats}
        step={1}
      />
    </CalculatorCard>
  );
}
