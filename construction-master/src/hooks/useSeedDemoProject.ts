import { useEffect } from 'react';
import { settingsRepository } from '../storage/repositories/settingsRepository';
import { projectRepository } from '../storage/repositories/projectRepository';
import { buildDemoProject } from '../projects/demoProject';

/**
 * Na primeira execução do app (nenhuma configuração salva ainda), cria a
 * obra de demonstração "Chácara — Casa 250m²" e a define como obra ativa —
 * isso permite testar o sistema imediatamente, sem telas vazias. Só roda
 * uma vez (controlado por `onboardingSeeded` em settings).
 */
export function useSeedDemoProject(): void {
  useEffect(() => {
    let cancelled = false;

    async function seed() {
      const settings = await settingsRepository.get();
      if (settings.onboardingSeeded || cancelled) return;

      const demo = buildDemoProject();
      await projectRepository.save(demo);
      await settingsRepository.set({ onboardingSeeded: true, activeProjectId: demo.id });
    }

    void seed();
    return () => {
      cancelled = true;
    };
  }, []);
}
