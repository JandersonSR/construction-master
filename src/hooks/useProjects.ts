import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';
import { projectRepository } from '../storage/repositories/projectRepository';
import type { Project } from '../domain/types';

/** Lista reativa de obras (atualiza automaticamente quando o IndexedDB muda). */
export function useProjects(): Project[] | undefined {
  return useLiveQuery(() => db.projects.orderBy('updatedAt').reverse().toArray(), []);
}

/** Obra única, reativa. */
export function useProject(id: string | undefined): Project | undefined {
  return useLiveQuery(() => (id ? db.projects.get(id) : undefined), [id]);
}

export async function saveProject(project: Project): Promise<void> {
  await projectRepository.save(project);
}

export async function deleteProject(id: string): Promise<void> {
  await projectRepository.remove(id);
}
