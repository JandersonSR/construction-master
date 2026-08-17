import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import { calculateRoofMaterials, DEFAULT_WASTE_PERCENT_ROOF } from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';

export function RoofCalculator() {
  const { t } = useTranslation();
  const [footprint, setFootprint] = useState<number | ''>('');
  const [pitch, setPitch] = useState<number | ''>(30);
  const [tileCoverage, setTileCoverage] = useState<number | ''>(1);
  const [waste, setWaste] = useState<number | ''>(DEFAULT_WASTE_PERCENT_ROOF);

  const { result, error } = useMemo(() => {
    try {
      if (footprint === '' || pitch === '' || tileCoverage === '') {
        return { result: null, error: undefined };
      }
      const r = calculateRoofMaterials(
        footprint,
        pitch,
        tileCoverage,
        waste === '' ? 0 : waste,
      );
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [footprint, pitch, tileCoverage, waste, t]);

  return (
    <CalculatorCard
      title={t('calculators.roof.title')}
      error={error}
      result={
        result ? (
          <>
            <ResultRow
              label={t('calculators.roof.resultRoofArea')}
              value={formatQuantity(result.roofAreaM2, t('common.units.m2'))}
            />
            <ResultRow
              label={t('calculators.roof.resultTiles')}
              value={formatQuantity(result.tiles, t('common.units.unit'), 0)}
            />
          </>
        ) : undefined
      }
    >
      <NumberField
        label={t('calculators.roof.footprintArea')}
        value={footprint}
        onChange={setFootprint}
      />
      <NumberField
        label={t('calculators.roof.pitch')}
        value={pitch}
        onChange={setPitch}
        step={1}
      />
      <NumberField
        label={t('calculators.roof.tileCoverage')}
        value={tileCoverage}
        onChange={setTileCoverage}
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
