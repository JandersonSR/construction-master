import { describe, it, expect } from 'vitest';
import { calculateSolarHeatingSystem } from './solarHeating';
import { CalculationInputError } from '../validation';

describe('solarHeating', () => {
  it('dimensiona reservatorio e numero de coletores a partir dos moradores', () => {
    const result = calculateSolarHeatingSystem(4, 1.5, 60);
    expect(result.reservoirLiters).toBe(240); // 4 * 60
    expect(result.collectorsCount).toBe(3); // ceil(240/75/1.5) = ceil(2.13) = 3
    expect(result.collectorAreaM2).toBe(result.collectorsCount * 1.5);
  });

  it('usa 60L por pessoa como padrao', () => {
    const result = calculateSolarHeatingSystem(2, 1.5);
    expect(result.reservoirLiters).toBe(120);
  });

  it('nunca retorna zero coletores mesmo para demanda minima', () => {
    const result = calculateSolarHeatingSystem(0.1, 5, 10);
    expect(result.collectorsCount).toBeGreaterThanOrEqual(1);
  });

  it('rejeita entradas invalidas', () => {
    expect(() => calculateSolarHeatingSystem(0, 1.5)).toThrow(CalculationInputError);
    expect(() => calculateSolarHeatingSystem(4, 0)).toThrow(CalculationInputError);
    expect(() => calculateSolarHeatingSystem(-1, 1.5)).toThrow(CalculationInputError);
  });
});
