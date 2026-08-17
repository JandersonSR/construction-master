import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects, deleteProject } from '../hooks/useProjects';
import { useSettings } from '../hooks/useSettings';
import { EmptyState } from '../components/ui/EmptyState';
import { formatPercent } from '../utils/format';

export default function ProjectHomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const projects = useProjects();
  const { settings, update } = useSettings();

  async function handleOpen(id: string) {
    await update({ activeProjectId: id });
    navigate(`/project/${id}`);
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(t('common.confirmDelete'))) return;
    await deleteProject(id);
    if (settings.activeProjectId === id) {
      await update({ activeProjectId: undefined });
    }
    void name;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('nav.myProject')}
        </h1>
        <Link to="/project/new" className="btn-primary">
          {t('nav.newProject')}
        </Link>
      </div>

      {projects === undefined ? null : projects.length === 0 ? (
        <EmptyState
          title={t('common.empty.noProjects')}
          action={
            <Link to="/project/new" className="btn-primary">
              {t('nav.newProject')}
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => {
            const doneCount = project.stages.filter((s) => s.status === 'done').length;
            const progress =
              project.stages.length > 0 ? (doneCount / project.stages.length) * 100 : 0;
            return (
              <li key={project.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="flex-1 text-left"
                    onClick={() => handleOpen(project.id)}
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {project.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {project.location ?? '—'} · {project.dimensions.area ?? '—'} m² ·{' '}
                      {formatPercent(progress)}
                    </p>
                  </button>
                  <button
                    className="btn-ghost text-red-600 dark:text-red-400"
                    aria-label={t('common.actions.delete')}
                    onClick={() => handleDelete(project.id, project.name)}
                  >
                    {t('common.actions.delete')}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
