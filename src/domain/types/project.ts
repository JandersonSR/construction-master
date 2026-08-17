import type { ProjectStage } from './stage';
import type { LaborMode } from './labor';

export type ProjectType = 'house' | 'renovation' | 'addition' | 'commercial' | 'other';
export type FinishLevel = 'economy' | 'standard' | 'high';

export interface ProjectDimensions {
  length?: number;
  width?: number;
  height?: number;
  area?: number;
  perimeter?: number;
  doors?: number;
  windows?: number;
}

export interface Room {
  id: string;
  name: string;
  area: number;
  wallHeight?: number;
}

export interface Project {
  id: string;
  name: string;
  location?: string;
  type: ProjectType;
  purpose?: string;
  floors: number;
  dimensions: ProjectDimensions;
  constructionMethodId?: string;
  finishLevel: FinishLevel;
  rooms: Room[];
  stages: ProjectStage[];
  laborMode: LaborMode;
  priceOverrides: Record<string, number>;
  scenarioOf?: string;
  createdAt: string;
  updatedAt: string;
}
