import { describe, it, expect } from 'vitest';
import { calculateRoofMaterials } from './roof';
import { CalculationInputError } from '../validation';

describe('roof', () => {
  it('telhado plano (0 graus): área real = área de projeção', () => {
    const result = calculateRoofMaterials(100, 0, 1);
    expect(result.roofAreaM2).toBeCloseTo(100, 5);
  });

  it('inclinação aumenta a área real do telhado', () => {
    const result = calculateRoofMaterials(100, 30, 1);
    // 100 / cos(30deg) = 100 / 0.8660 = 115.47
    expect(result.roofAreaM2).toBeCloseTo(115.47, 1);
    expect(result.roofAreaM2).toBeGreaterThan(100);
  });

  it('calcula número de telhas com perda', () => {
    const result = calculateRoofMaterials(100, 0, 1, 10);
    expect(result.tiles).toBe(110); // 100 * 1.10 / 1
  });

  it('rejeita inclinação >= 90 graus', () => {
    expect(() => calculateRoofMaterials(100, 90, 1)).toThrow(CalculationInputError);
  });
});
