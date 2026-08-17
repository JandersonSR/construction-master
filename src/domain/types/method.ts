export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ConstructionMethod {
  id: string;
  nameKey: string;
  descriptionKey: string;
  prosKeys: string[];
  consKeys: string[];
  speed: Rating;
  difficulty: Rating;
  durability: Rating;
  maintenance: Rating;
  wasteLevel: Rating;
  skillRequired: Rating;
  /** multiplicador aplicado a um custo base de referência por m² (1 = referência) */
  relativeCostFactor: number;
  materialIds: string[];
  toolIds: string[];
}
