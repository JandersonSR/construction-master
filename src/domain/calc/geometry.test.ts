import { describe, it, expect } from 'vitest';
import {
  calculateArea,
  calculateRectanglePerimeter,
  calculateWallArea,
  calculateVolume,
  calculateTotalFloorArea,
} from './geometry';
import { CalculationInputError } from '../validation';

describe('geometry', () => {
  it('calculateArea multiplica comprimento x largura', () => {
    expect(calculateArea(5, 4)).toBe(20);
  });

  it('calculateRectanglePerimeter soma os 4 lados', () => {
    expect(calculateRectanglePerimeter(5, 4)).toBe(18);
  });

  it('calculateWallArea desconta vãos do exemplo documentado (docs/CALCULATION_ENGINE.md)', () => {
    // parede 5x4, pé-direito 2.8m, 1 porta (1.6m2) + 1 janela (1.2m2) = 2.8m2 de vãos
    const perimeter = calculateRectanglePerimeter(5, 4); // 18
    const result = calculateWallArea(perimeter, 2.8, 2.8);
    expect(result).toBeCloseTo(47.6, 5);
  });

  it('calculateWallArea sem vãos = perímetro x altura', () => {
    expect(calculateWallArea(18, 2.8)).toBeCloseTo(50.4, 5);
  });

  it('calculateWallArea rejeita vãos maiores que a área bruta', () => {
    expect(() => calculateWallArea(10, 2, 1000)).toThrow(CalculationInputError);
  });

  it('calculateVolume multiplica as 3 dimensões', () => {
    expect(calculateVolume(2, 3, 4)).toBe(24);
  });

  it('calculateTotalFloorArea soma áreas de cômodos', () => {
    expect(calculateTotalFloorArea([12, 8, 15.5])).toBeCloseTo(35.5, 5);
  });

  it('rejeita entradas não positivas', () => {
    expect(() => calculateArea(0, 5)).toThrow(CalculationInputError);
    expect(() => calculateArea(-1, 5)).toThrow(CalculationInputError);
    expect(() => calculateVolume(1, 1, 0)).toThrow(CalculationInputError);
  });
});
