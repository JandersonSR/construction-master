import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import {
  calculateArea,
  calculateRectanglePerimeter,
  calculateWallArea,
} from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';

export function GeometryCalculator() {
  const { t } = useTranslation();
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [openingsArea, setOpeningsArea] = useState<number | ''>(0);

  const { result, error } = useMemo(() => {
    try {
      if (length === '' || width === '') return { result: null, error: undefined };
      const area = calculateArea(length, width);
      const perimeter = calculateRectanglePerimeter(length, width);
      const wallArea =
        height !== ''
          ? calculateWallArea(perimeter, height, openingsArea === '' ? 0 : openingsArea)
          : undefined;
      return { result: { area, perimeter, wallArea }, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError) {
        return { result: null, error: t(err.reasonKey) };
      }
      throw err;
    }
  }, [length, width, height, openingsArea, t]);

  return (
    <CalculatorCard
      title={t('calculators.geometry.title')}
      error={error}
      result={
        result ? (
          <>
            <ResultRow
              label={t('calculators.geometry.resultArea')}
              value={formatQuantity(result.area, t('common.units.m2'))}
            />
            <ResultRow
              label={t('calculators.geometry.resultPerimeter')}
              value={formatQuantity(result.perimeter, t('common.units.m'))}
            />
            {result.wallArea !== undefined ? (
              <ResultRow
                label={t('calculators.geometry.resultWallArea')}
                value={formatQuantity(result.wallArea, t('common.units.m2'))}
              />
            ) : null}
          </>
        ) : undefined
      }
    >
      <NumberField
        label={t('calculators.geometry.length')}
        value={length}
        onChange={setLength}
      />
      <NumberField
        label={t('calculators.geometry.width')}
        value={width}
        onChange={setWidth}
      />
      <NumberField
        label={t('calculators.geometry.height')}
        value={height}
        onChange={setHeight}
      />
      <NumberField
        label={t('calculators.geometry.openingsArea')}
        value={openingsArea}
        onChange={setOpeningsArea}
      />
    </CalculatorCard>
  );
}
