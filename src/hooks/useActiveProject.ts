import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';
import { useSettings } from './useSettings';
import type { Project } from '../domain/types';

/**
 * Obra "ativa" — a última usada pelo usuário (settings.activeProjectId), ou
 * a mais recentemente atualizada, se nenhuma estiver marcada como ativa.
 */
export function useActiveProject(): { project: Project | undefined; loading: boolean } {
  const { settings, loaded } = useSettings();
  const projects = useLiveQuery(
    () => db.projects.orderBy('updatedAt').reverse().toArray(),
    [],
  );

  if (!loaded || projects === undefined) {
    return { project: undefined, loading: true };
  }

  const active = settings.activeProjectId
    ? projects.find((p) => p.id === settings.activeProjectId)
    : undefined;

  return { project: active ?? projects[0], loading: false };
}
