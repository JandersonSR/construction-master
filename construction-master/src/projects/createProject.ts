import { nanoid } from '../utils/id';
import { stageDefinitions } from '../construction/stages';
import type {
  FinishLevel,
  Project,
  ProjectDimensions,
  ProjectStage,
  ProjectType,
  Room,
} from '../domain/types';

export function buildDefaultStages(): ProjectStage[] {
  return stageDefinitions.map((def) => ({
    id: nanoid(),
    stageDefId: def.id,
    status: 'not_started',
    laborMode: 'diy',
    laborConfig: {},
    materials: [],
    checklist: def.checklistItemKeys.map((labelKey, i) => ({
      id: `${def.id}-check-${i}`,
      labelKey,
      done: false,
    })),
    estimatedCost: 0,
  }));
}

export interface NewProjectInput {
  name: string;
  location?: string;
  type: ProjectType;
  purpose?: string;
  floors: number;
  dimensions: ProjectDimensions;
  rooms: Room[];
  constructionMethodId?: string;
  finishLevel: FinishLevel;
}

export function createProject(input: NewProjectInput): Project {
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    name: input.name,
    location: input.location,
    type: input.type,
    purpose: input.purpose,
    floors: input.floors,
    dimensions: input.dimensions,
    constructionMethodId: input.constructionMethodId,
    finishLevel: input.finishLevel,
    rooms: input.rooms,
    stages: buildDefaultStages(),
    laborMode: 'diy',
    priceOverrides: {},
    createdAt: now,
    updatedAt: now,
  };
}

/** Duplica uma obra como um novo cenário alternativo (mesmos dados, novo id). */
export function duplicateAsScenario(project: Project, newName: string): Project {
  const now = new Date().toISOString();
  return {
    ...project,
    id: nanoid(),
    name: newName,
    scenarioOf: project.id,
    createdAt: now,
    updatedAt: now,
  };
}
