import { useTranslation } from 'react-i18next';
import { videoCatalog } from '../videos/catalog';
import { getYoutubeThumbnailUrl } from '../videos/types';

export default function VideosPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('videos.title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('videos.subtitle')}
        </p>
      </div>
      <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {t('videos.offlineNotice')}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {videoCatalog.map((video) => {
          const thumb = getYoutubeThumbnailUrl(video.url);
          return (
            <li key={video.id} className="card">
              <a href={video.url} target="_blank" rel="noreferrer" className="block">
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    className="mb-3 aspect-video w-full rounded-lg object-cover"
                  />
                ) : null}
                <p className="badge mb-1 bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200">
                  {t(video.categoryKey)}
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {video.title}
                </p>
                {video.description ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {video.description}
                  </p>
                ) : null}
                <p className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-400">
                  ▶ {t('videos.watchOnYoutube')}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
