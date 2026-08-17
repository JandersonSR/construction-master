import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getOrderedStageDefinitions } from '../construction/stages';
import { useActiveProject } from '../hooks/useActiveProject';

const REQUIRES_COLORS: Record<string, string> = {
  none: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  recommended: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  required: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
};

export default function GuideIndexPage() {
  const { t } = useTranslation();
  const { project } = useActiveProject();
  const stages = getOrderedStageDefinitions();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('nav.guide')}
      </h1>
      <ul className="space-y-2">
        {stages.map((def) => {
          const content = (
            <div className="card flex items-center justify-between gap-3 hover:shadow-md">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {def.order}. {t(def.nameKey)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t(def.categoryKey)}
                </p>
              </div>
              <span className={`badge ${REQUIRES_COLORS[def.requiresProfessional]}`}>
                {t(`stages.requiresProfessional.${def.requiresProfessional}`)}
              </span>
            </div>
          );
          return (
            <li key={def.id}>
              {project ? (
                <Link to={`/project/${project.id}/stage/${def.id}`}>{content}</Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
      {!project ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('common.empty.noProjects')}{' '}
          <Link
            to="/project/new"
            className="text-brand-600 hover:underline dark:text-brand-400"
          >
            {t('nav.newProject')}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
