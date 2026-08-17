import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../db';
import { projectRepository } from './projectRepository';
import { createProject } from '../../projects/createProject';

function buildTestProject(name: string) {
  return createProject({
    name,
    type: 'house',
    floors: 1,
    dimensions: { length: 10, width: 10 },
    rooms: [],
    finishLevel: 'standard',
  });
}

describe('projectRepository (integração com IndexedDB via Dexie)', () => {
  beforeEach(async () => {
    await db.projects.clear();
  });

  it('save() persiste uma obra e list() a retorna', async () => {
    const project = buildTestProject('Casa de teste');
    await projectRepository.save(project);

    const all = await projectRepository.list();
    expect(all).toHaveLength(1);
    expect(all[0]?.id).toBe(project.id);
    expect(all[0]?.name).toBe('Casa de teste');
  });

  it('get() retorna a obra pelo id, ou undefined se não existir', async () => {
    const project = buildTestProject('Casa A');
    await projectRepository.save(project);

    const found = await projectRepository.get(project.id);
    expect(found?.name).toBe('Casa A');

    const notFound = await projectRepository.get('id-inexistente');
    expect(notFound).toBeUndefined();
  });

  it('save() em cima de um id existente edita a obra (upsert) e atualiza updatedAt', async () => {
    const project = buildTestProject('Nome original');
    await projectRepository.save(project);
    const beforeUpdatedAt = (await projectRepository.get(project.id))?.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 5));
    await projectRepository.save({ ...project, name: 'Nome editado' });

    const all = await projectRepository.list();
    expect(all).toHaveLength(1); // não duplicou — foi um update, não um insert
    expect(all[0]?.name).toBe('Nome editado');
    expect(all[0]?.updatedAt).not.toBe(beforeUpdatedAt);
  });

  it('remove() apaga a obra permanentemente', async () => {
    const project = buildTestProject('Obra a remover');
    await projectRepository.save(project);
    expect(await projectRepository.list()).toHaveLength(1);

    await projectRepository.remove(project.id);
    expect(await projectRepository.list()).toHaveLength(0);
    expect(await projectRepository.get(project.id)).toBeUndefined();
  });

  it('list() ordena por updatedAt decrescente (mais recente primeiro)', async () => {
    const a = buildTestProject('Primeira');
    await projectRepository.save(a);
    await new Promise((resolve) => setTimeout(resolve, 5));
    const b = buildTestProject('Segunda');
    await projectRepository.save(b);

    const all = await projectRepository.list();
    expect(all[0]?.name).toBe('Segunda');
    expect(all[1]?.name).toBe('Primeira');
  });
});
