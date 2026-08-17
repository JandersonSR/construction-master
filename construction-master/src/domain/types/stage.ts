import type { SafetyLevel } from './units';
import type { LaborConfig, LaborMode } from './labor';
import type { StageMaterialLine } from './material';

export type StageStatus = 'not_started' | 'in_progress' | 'done';

export interface StageToolset {
  essentialKeys: string[];
  optionalKeys: string[];
  safetyKeys: string[];
}

/** Dados estáticos de uma etapa (não pertencem a uma obra específica). */
export interface StageDefinition {
  id: string;
  order: number;
  nameKey: string;
  categoryKey: string;
  objectiveKey: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  requiresProfessional: SafetyLevel;
  tools: StageToolset;
  prerequisiteStageIds: string[];
  /** chaves i18n para cada passo do guia (guides.<stageId>.steps.N) */
  stepKeys: string[];
  commonMistakeKeys: string[];
  tipKeys: string[];
  checklistItemKeys: string[];
  relatedVideoIds: string[];
  /** true = conteúdo completo (V1); false = estrutura pronta, texto resumido */
  contentComplete: boolean;
}

export interface ChecklistItem {
  id: string;
  labelKey: string;
  done: boolean;
  note?: string;
  photoRef?: string;
  date?: string;
}

/** Instância de uma etapa dentro de uma obra do usuário. */
export interface ProjectStage {
  id: string;
  stageDefId: string;
  status: StageStatus;
  laborMode: LaborMode;
  laborConfig: LaborConfig;
  materials: StageMaterialLine[];
  checklist: ChecklistItem[];
  estimatedCost: number;
  actualCost?: number;
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
}
