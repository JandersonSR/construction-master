import type { Unit } from './units';

export type MaterialCategory =
  | 'cement'
  | 'aggregate'
  | 'masonry'
  | 'steel'
  | 'wood'
  | 'paint'
  | 'flooring'
  | 'roofing'
  | 'hydraulic'
  | 'electrical'
  | 'network'
  | 'solar'
  | 'hardware'
  | 'other';

/** Item estático do catálogo de preços — nunca hardcode preços na UI. */
export interface MaterialDefinition {
  id: string;
  /** chave de tradução, ex.: "materials.cement.name" */
  nameKey: string;
  unit: Unit;
  category: MaterialCategory;
  /** preço de referência em BRL — sempre rotulado como estimativa na UI */
  defaultPrice: number;
  source?: string;
  lastUpdated?: string;
  note?: string;
}

/** Override de preço definido pelo usuário (global, aplica a todas as obras). */
export interface PriceOverride {
  materialId: string;
  price: number;
  supplier?: string;
  date: string;
  note?: string;
}

/** Linha de material dentro de uma etapa de uma obra específica. */
export interface StageMaterialLine {
  materialId: string;
  quantity: number;
  unit: Unit;
  unitPriceOverride?: number;
  purchased: boolean;
}
