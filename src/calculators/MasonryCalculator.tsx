import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculateMasonryMaterials, DEFAULT_WASTE_PERCENT_MASONRY } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';
import { blockCatalog } from '../domain/pricing/blocks';

export function MasonryCalculator() {
  const { t } = useTranslation();
  const [wallArea, setWallArea] = useState<number | ''>('');
  const [blockId, setBlockId] = useState(blockCatalog[0]!.id);
  const [waste, setWaste] = useState<number | ''>(DEFAULT_WASTE_PERCENT_MASONRY);

  const block = blockCatalog.find((b) => b.id === blockId)!;

  const { result, error } = useMemo(() => {
    try {
      if (wallArea === '') return { result: null, error: undefined };
      const r = calculateMasonryMaterials(wallArea, block, waste === '' ? 0 : waste);
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [wallArea, block, waste, t]);

  return (
    <CalculatorCard
      title={t('calculators.masonry.title')}
      error={error}
      result={
        result ? (
          <>
            <ResultRow
              label={t('calculators.masonry.resultUnits')}
              value={formatQuantity(Math.ceil(result.units), t('common.units.unit'), 0)}
            />
            <ResultRow
              label={t('calculators.masonry.resultMortar')}
              value={formatQuantity(result.mortarM3, t('common.units.m3'))}
            />
          </>
        ) : undefined
      }
    >
      <NumberField
        label={t('calculators.geometry.resultWallArea')}
        value={wallArea}
        onChange={setWallArea}
      />
      <div>
        <label className="label">{t('calculators.masonry.blockType')}</label>
        <select
          className="input"
          value={blockId}
          onChange={(e) => setBlockId(e.target.value)}
        >
          {blockCatalog.map((b) => (
            <option key={b.id} value={b.id}>
              {t(b.nameKey)}
            </option>
          ))}
        </select>
      </div>
      <NumberField
        label={t('calculators.masonry.wastePercent')}
        value={waste}
        onChange={setWaste}
        step={1}
      />
    </CalculatorCard>
  );
}
