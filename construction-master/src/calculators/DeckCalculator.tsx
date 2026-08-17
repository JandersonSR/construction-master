import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberField } from '../components/ui/NumberField';
import { CalculatorCard, ResultRow } from './CalculatorCard';
import {
  calculateDeckMaterials,
  calculatePoolLoadEstimate,
  DEFAULT_WASTE_PERCENT_DECK,
} from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { formatQuantity } from '../utils/format';
import { SafetyNotice } from '../components/ui/SafetyNotice';

export function DeckCalculator() {
  const { t } = useTranslation();
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [boardCoverage, setBoardCoverage] = useState<number | ''>(0.15);
  const [joistSpacing, setJoistSpacing] = useState<number | ''>(0.4);
  const [waste, setWaste] = useState<number | ''>(DEFAULT_WASTE_PERCENT_DECK);

  const { result, error } = useMemo(() => {
    try {
      if (length === '' || width === '' || boardCoverage === '' || joistSpacing === '') {
        return { result: null, error: undefined };
      }
      const r = calculateDeckMaterials(
        length,
        width,
        boardCoverage,
        joistSpacing,
        waste === '' ? 0 : waste,
      );
      return { result: r, error: undefined };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { result: null, error: t(err.reasonKey) };
      throw err;
    }
  }, [length, width, boardCoverage, joistSpacing, waste, t]);

  const [poolVolume, setPoolVolume] = useState<number | ''>('');
  const [structureWeight, setStructureWeight] = useState<number | ''>('');
  const { poolResult, poolError } = useMemo(() => {
    try {
      if (poolVolume === '' || structureWeight === '') {
        return { poolResult: null, poolError: undefined };
      }
      return {
        poolResult: calculatePoolLoadEstimate(poolVolume, structureWeight),
        poolError: undefined,
      };
    } catch (err) {
      if (err instanceof CalculationInputError)
        return { poolResult: null, poolError: t(err.reasonKey) };
      throw err;
    }
  }, [poolVolume, structureWeight, t]);

  return (
    <>
      <CalculatorCard
        title={t('calculators.deck.title')}
        error={error}
        result={
          result ? (
            <>
              <ResultRow
                label={t('calculators.deck.resultArea')}
                value={formatQuantity(result.deckAreaM2, t('common.units.m2'))}
              />
              <ResultRow
                label={t('calculators.deck.resultBoards')}
                value={formatQuantity(result.boards, t('common.units.unit'), 0)}
              />
              <ResultRow
                label={t('calculators.deck.resultJoists')}
                value={formatQuantity(result.joists, t('common.units.unit'), 0)}
              />
              <ResultRow
                label={t('calculators.deck.resultScrews')}
                value={formatQuantity(result.screws, t('common.units.unit'), 0)}
              />
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
          label={t('calculators.deck.boardCoverage')}
          value={boardCoverage}
          onChange={setBoardCoverage}
        />
        <NumberField
          label={t('calculators.deck.joistSpacing')}
          value={joistSpacing}
          onChange={setJoistSpacing}
        />
        <NumberField
          label={t('calculators.masonry.wastePercent')}
          value={waste}
          onChange={setWaste}
          step={1}
        />
      </CalculatorCard>

      <CalculatorCard
        title={t('calculators.deck.poolLoadTitle')}
        error={poolError}
        result={
          poolResult ? (
            <>
              <ResultRow
                label={t('calculators.deck.resultWaterWeight')}
                value={formatQuantity(poolResult.waterWeightKg, t('common.units.kg'), 0)}
              />
              <ResultRow
                label={t('calculators.deck.resultTotalLoad')}
                value={formatQuantity(poolResult.totalLoadKg, t('common.units.kg'), 0)}
              />
            </>
          ) : undefined
        }
      >
        <NumberField
          label={t('calculators.deck.poolVolume')}
          value={poolVolume}
          onChange={setPoolVolume}
        />
        <NumberField
          label={t('calculators.deck.structureWeight')}
          value={structureWeight}
          onChange={setStructureWeight}
        />
      </CalculatorCard>
      <SafetyNotice level="required" />
    </>
  );
}
