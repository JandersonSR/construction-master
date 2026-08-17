import { describe, it, expect } from 'vitest';
import { calculateMasonryMaterials, type BlockDefinition } from './masonry';
import { CalculationInputError } from '../validation';

const ceramicBlock: BlockDefinition = {
  id: 'ceramic-9x19x39',
  nameKey: 'materials.ceramicBlock.name',
  coverageAreaM2: 0.135, // ~ 9x19x39cm com junta
  mortarM3PerM2: 0.02,
};

describe('masonry', () => {
  it('calcula unidades com 10% de perda default', () => {
    const result = calculateMasonryMaterials(47.6, ceramicBlock);
    const expectedNet = 47.6 / 0.135;
    expect(result.units).toBeCloseTo(expectedNet * 1.1, 2);
    expect(result.wastePercent).toBe(10);
  });

  it('calcula argamassa proporcional à área', () => {
    const result = calculateMasonryMaterials(50, ceramicBlock);
    expect(result.mortarM3).toBeCloseTo(1, 5);
  });

  it('permite perda customizada', () => {
    const result = calculateMasonryMaterials(50, ceramicBlock, 20);
    const net = 50 / 0.135;
    expect(result.units).toBeCloseTo(net * 1.2, 2);
  });

  it('rejeita área inválida', () => {
    expect(() => calculateMasonryMaterials(0, ceramicBlock)).toThrow(
      CalculationInputError,
    );
  });
});
