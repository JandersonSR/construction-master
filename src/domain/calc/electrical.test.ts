import { describe, it, expect } from 'vitest';
import { calculateElectricalRoughEstimate } from './electrical';
import { CalculationInputError } from '../validation';

describe('electrical', () => {
  it('estima tomadas, interruptores, cabos e circuitos a partir dos comodos', () => {
    const result = calculateElectricalRoughEstimate(6, 4);
    expect(result.outletsEstimate).toBe(24); // 6 * 4
    expect(result.switchesEstimate).toBe(6); // 1 por comodo
    expect(result.cableMetersEstimate).toBe((24 + 6) * 5); // total de pontos * 5m
    expect(result.circuitsEstimate).toBe(Math.ceil((24 + 6) / 6));
  });

  it('usa 4 tomadas por comodo como padrao', () => {
    const result = calculateElectricalRoughEstimate(3);
    expect(result.outletsEstimate).toBe(12);
  });

  it('arredonda circuitos para cima (nunca fraciona um circuito)', () => {
    const result = calculateElectricalRoughEstimate(1, 1);
    // 1 tomada + 1 interruptor = 2 pontos => 1 circuito (2/6 arredondado pra cima)
    expect(result.circuitsEstimate).toBe(1);
    expect(Number.isInteger(result.circuitsEstimate)).toBe(true);
  });

  it('rejeita numero de comodos invalido', () => {
    expect(() => calculateElectricalRoughEstimate(0)).toThrow(CalculationInputError);
    expect(() => calculateElectricalRoughEstimate(-1)).toThrow(CalculationInputError);
    expect(() => calculateElectricalRoughEstimate(2.5)).toThrow(CalculationInputError);
  });
});
