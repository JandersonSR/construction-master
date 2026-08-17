import { beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import {
  BACKUP_FORMAT_VERSION,
  BackupImportError,
  exportBackup,
  importBackup,
} from './backup';
import { projectRepository } from './repositories/projectRepository';
import { priceRepository } from './repositories/priceRepository';
import { settingsRepository } from './repositories/settingsRepository';
import { createProject } from '../projects/createProject';

function buildTestProject(name: string) {
  return createProject({
    name,
    type: 'renovation',
    floors: 2,
    dimensions: { length: 8, width: 12 },
    rooms: [],
    finishLevel: 'economy',
  });
}

describe('backup (export/import — integração com IndexedDB via Dexie)', () => {
  beforeEach(async () => {
    await db.projects.clear();
    await db.priceOverrides.clear();
    await db.settings.clear();
  });

  it('exportBackup() inclui obras, overrides de preço e configurações', async () => {
    const project = buildTestProject('Obra exportada');
    await projectRepository.save(project);
    await priceRepository.setOverride({
      materialId: 'cimento-50kg',
      price: 42.5,
      date: '2026-08-17',
    });
    await settingsRepository.set({ theme: 'dark' });

    const backup = await exportBackup();

    expect(backup.version).toBe(BACKUP_FORMAT_VERSION);
    expect(backup.data.projects).toHaveLength(1);
    expect(backup.data.projects[0]?.name).toBe('Obra exportada');
    expect(backup.data.priceOverrides).toEqual([
      { materialId: 'cimento-50kg', price: 42.5, date: '2026-08-17' },
    ]);
    expect(backup.data.settings.theme).toBe('dark');
  });

  it('importBackup() restaura exatamente o que foi exportado (round-trip)', async () => {
    const project = buildTestProject('Obra original');
    await projectRepository.save(project);
    await priceRepository.setOverride({
      materialId: 'areia-m3',
      price: 120,
      date: '2026-08-17',
    });

    const backup = await exportBackup();

    // Simula perda de dados locais e depois restauração.
    await db.projects.clear();
    await db.priceOverrides.clear();
    expect(await projectRepository.list()).toHaveLength(0);

    await importBackup(backup);

    const projects = await projectRepository.list();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.id).toBe(project.id);
    expect(projects[0]?.name).toBe('Obra original');

    const overrides = await priceRepository.listOverrides();
    expect(overrides).toEqual([
      { materialId: 'areia-m3', price: 120, date: '2026-08-17' },
    ]);
  });

  it('importBackup() substitui completamente os dados atuais (não faz merge)', async () => {
    await projectRepository.save(buildTestProject('Obra que deve desaparecer'));
    const backup = await exportBackup(); // backup vazio de outra obra, propositalmente diferente

    const otherProject = buildTestProject('Obra do backup');
    await importBackup({
      version: BACKUP_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      data: { projects: [otherProject], priceOverrides: [], settings: {} },
    });

    const projects = await projectRepository.list();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe('Obra do backup');
    void backup;
  });

  it('importBackup() rejeita payload sem o formato esperado', async () => {
    await expect(importBackup(null)).rejects.toThrow(BackupImportError);
    await expect(importBackup({})).rejects.toThrow(BackupImportError);
    await expect(importBackup('not-an-object')).rejects.toThrow(BackupImportError);
  });

  it('importBackup() rejeita versão de backup incompatível', async () => {
    await expect(
      importBackup({
        version: BACKUP_FORMAT_VERSION + 99,
        exportedAt: new Date().toISOString(),
        data: { projects: [], priceOverrides: [], settings: {} },
      }),
    ).rejects.toThrow(BackupImportError);
  });

  it('um import inválido não apaga os dados existentes (falha antes da transação)', async () => {
    await projectRepository.save(buildTestProject('Obra protegida'));

    await expect(importBackup({ version: 999, data: {} })).rejects.toThrow(
      BackupImportError,
    );

    const projects = await projectRepository.list();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe('Obra protegida');
  });
});
