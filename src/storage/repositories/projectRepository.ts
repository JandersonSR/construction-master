import type { Project } from '../../domain/types';
import { db } from '../db';

/**
 * Interface de repositório de obras. A UI depende apenas desta interface,
 * nunca de `Dexie` diretamente — isso permite trocar a implementação (ex.:
 * uma futura `ApiProjectRepository` para sincronização em nuvem, v3+) sem
 * tocar em nenhuma tela.
 */
export interface ProjectRepository {
  list(): Promise<Project[]>;
  get(id: string): Promise<Project | undefined>;
  save(project: Project): Promise<void>;
  remove(id: string): Promise<void>;
}

export class DexieProjectRepository implements ProjectRepository {
  async list(): Promise<Project[]> {
    return db.projects.orderBy('updatedAt').reverse().toArray();
  }

  async get(id: string): Promise<Project | undefined> {
    return db.projects.get(id);
  }

  async save(project: Project): Promise<void> {
    await db.projects.put({ ...project, updatedAt: new Date().toISOString() });
  }

  async remove(id: string): Promise<void> {
    await db.projects.delete(id);
  }
}

export const projectRepository: ProjectRepository = new DexieProjectRepository();
