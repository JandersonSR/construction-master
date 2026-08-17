import { describe, it, expect } from 'vitest';
import { calculateSolarSystem } from './solar';
import { CalculationInputError } from '../validation';

describe('solar', () => {
  it('dimensiona sistema a partir do consumo mensal', () => {
    const result = calculateSolarSystem(300, 550, 2.6, 15000, 250, 4.5, 0.75);
    expect(result.dailyConsumptionKwh).toBe(10); // 300/30
    expect(result.systemSizeKwp).toBeCloseTo(10 / (4.5 * 0.75), 5);
    expect(result.panelsCount).toBeGreaterThan(0);
    expect(result.requiredAreaM2).toBe(result.panelsCount * 2.6);
  });

  it('calcula payback quando há economia mensal', () => {
    const result = calculateSolarSystem(300, 550, 2.6, 15000, 250);
    expect(result.paybackMonths).toBeCloseTo(15000 / 250, 5);
  });

  it('payback é null quando não há economia informada', () => {
    const result = calculateSolarSystem(300, 550, 2.6, 15000, 0);
    expect(result.paybackMonths).toBe(null);
  });

  it('rejeita performance ratio fora de 0.1-1', () => {
    expect(() => calculateSolarSystem(300, 550, 2.6, 15000, 250, 4.5, 1.5)).toThrow(
      CalculationInputError,
    );
  });
});
