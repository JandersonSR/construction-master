export type LaborMode = 'diy' | 'daily' | 'contract' | 'mixed';

export interface DailyLaborConfig {
  workers: number;
  dailyRate: number;
  days: number;
}

export interface ContractLaborConfig {
  totalValue: number;
}

export interface MixedLaborAssignment {
  id: string;
  role: string;
  mode: 'daily' | 'contract';
  workers?: number;
  dailyRate?: number;
  days?: number;
  totalValue?: number;
}

export interface LaborConfig {
  daily?: DailyLaborConfig;
  contract?: ContractLaborConfig;
  mixed?: MixedLaborAssignment[];
}
