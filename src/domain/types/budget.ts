export interface StageBudgetLine {
  stageDefId: string;
  materials: number;
  labor: number;
  total: number;
}

export interface BudgetSummary {
  materialsCost: number;
  laborCost: number;
  toolsCost: number;
  otherCost: number;
  contingency: number;
  total: number;
  costPerSquareMeter: number;
  byStage: StageBudgetLine[];
}

export interface MethodComparisonResult {
  methodAId: string;
  methodBId: string;
  totalA: number;
  totalB: number;
  diffAbs: number;
  diffPercent: number;
}
