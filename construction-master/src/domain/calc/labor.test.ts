import { describe, it, expect } from 'vitest';
import {
  calculateDailyLaborCost,
  calculateContractLaborCost,
  calculateMixedLaborCost,
  calculateStageLaborCost,
} from './labor';

describe('labor', () => {
  it('diária: profissionais x diária x dias', () => {
    expect(calculateDailyLaborCost({ workers: 2, dailyRate: 150, days: 10 })).toBe(3000);
  });

  it('empreitada: valor fechado', () => {
    expect(calculateContractLaborCost({ totalValue: 8000 })).toBe(8000);
  });

  it('mista: soma diaristas e empreitadas por especialidade', () => {
    const total = calculateMixedLaborCost([
      { id: '1', role: 'pedreiro', mode: 'daily', workers: 1, dailyRate: 150, days: 5 },
      { id: '2', role: 'eletricista', mode: 'contract', totalValue: 2000 },
    ]);
    expect(total).toBe(150 * 5 + 2000);
  });

  it('DIY custa zero em dinheiro', () => {
    expect(calculateStageLaborCost('diy', {})).toBe(0);
  });

  it('calculateStageLaborCost despacha por modo corretamente', () => {
    expect(
      calculateStageLaborCost('daily', {
        daily: { workers: 2, dailyRate: 100, days: 3 },
      }),
    ).toBe(600);
    expect(calculateStageLaborCost('contract', { contract: { totalValue: 5000 } })).toBe(
      5000,
    );
  });
});
