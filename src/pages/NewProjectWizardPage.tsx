import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NumberField } from '../components/ui/NumberField';
import { createProject } from '../projects/createProject';
import { saveProject } from '../hooks/useProjects';
import { useSettings } from '../hooks/useSettings';
import {
  calculateArea,
  calculateRectanglePerimeter,
  calculateWallArea,
} from '../domain/calc';
import { CalculationInputError } from '../domain/validation';
import { constructionMethods } from '../construction/methods';
import type { FinishLevel, ProjectType, Room } from '../domain/types';
import { nanoid } from '../utils/id';

type WizardStep = 'info' | 'dimensions' | 'method' | 'review';
const STEPS: WizardStep[] = ['info', 'dimensions', 'method', 'review'];

const PROJECT_TYPES: ProjectType[] = [
  'house',
  'renovation',
  'addition',
  'commercial',
  'other',
];
const FINISH_LEVELS: FinishLevel[] = ['economy', 'standard', 'high'];

export default function NewProjectWizardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { update } = useSettings();

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<ProjectType>('house');
  const [purpose, setPurpose] = useState('');
  const [floors, setFloors] = useState<number | ''>(1);

  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>(2.8);
  const [doors, setDoors] = useState<number | ''>('');
  const [windows, setWindows] = useState<number | ''>('');
  const [rooms, setRooms] = useState<Room[]>([]);

  const [methodId, setMethodId] = useState<string>('conventional-masonry');
  const [finishLevel, setFinishLevel] = useState<FinishLevel>('standard');

  const dimensionResults = useMemo(() => {
    try {
      if (length === '' || width === '') return null;
      const area = calculateArea(length, width);
      const perimeter = calculateRectanglePerimeter(length, width);
      const openings = 1.6 * (Number(doors) || 0) + 1.2 * (Number(windows) || 0);
      const wallArea =
        height !== '' ? calculateWallArea(perimeter, height, openings) : undefined;
      return { area, perimeter, wallArea };
    } catch (err) {
      if (err instanceof CalculationInputError) return null;
      throw err;
    }
  }, [length, width, height, doors, windows]);

  function addRoom() {
    setRooms((r) => [...r, { id: nanoid(), name: '', area: 0 }]);
  }
  function updateRoom(id: string, patch: Partial<Room>) {
    setRooms((r) => r.map((room) => (room.id === id ? { ...room, ...patch } : room)));
  }
  function removeRoom(id: string) {
    setRooms((r) => r.filter((room) => room.id !== id));
  }

  async function handleFinish() {
    const project = createProject({
      name: name || t('project.wizard.info.namePlaceholder'),
      location: location || undefined,
      type,
      purpose: purpose || undefined,
      floors: Number(floors) || 1,
      dimensions: {
        length: length === '' ? undefined : length,
        width: width === '' ? undefined : width,
        height: height === '' ? undefined : height,
        area: dimensionResults?.area,
        perimeter: dimensionResults?.perimeter,
        doors: doors === '' ? undefined : doors,
        windows: windows === '' ? undefined : windows,
      },
      rooms,
      constructionMethodId: methodId || undefined,
      finishLevel,
    });
    await saveProject(project);
    await update({ activeProjectId: project.id });
    navigate(`/project/${project.id}`);
  }

  const canGoNext = step !== 'info' || name.trim().length > 0;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('project.wizard.title')}
      </h1>

      <ol className="flex gap-2 text-sm">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`flex-1 rounded-full px-2 py-1 text-center ${
              i === stepIndex
                ? 'bg-brand-600 text-white'
                : i < stepIndex
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
            }`}
          >
            {t(`project.wizard.steps.${s}`)}
          </li>
        ))}
      </ol>

      <div className="card space-y-4">
        {step === 'info' && (
          <>
            <TextField
              label={t('project.wizard.info.name')}
              value={name}
              onChange={setName}
              placeholder={t('project.wizard.info.namePlaceholder')}
            />
            <TextField
              label={t('project.wizard.info.location')}
              value={location}
              onChange={setLocation}
              placeholder={t('project.wizard.info.locationPlaceholder')}
            />
            <div>
              <label className="label">{t('project.wizard.info.type')}</label>
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
              >
                {PROJECT_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {t(`project.wizard.info.typeOptions.${pt}`)}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label={t('project.wizard.info.purpose')}
              value={purpose}
              onChange={setPurpose}
              placeholder={t('project.wizard.info.purposePlaceholder')}
            />
            <NumberField
              label={t('project.wizard.info.floors')}
              value={floors}
              onChange={setFloors}
              min={1}
              step={1}
            />
          </>
        )}

        {step === 'dimensions' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t('project.wizard.dimensions.length')}
                unit={t('common.units.m')}
                value={length}
                onChange={setLength}
              />
              <NumberField
                label={t('project.wizard.dimensions.width')}
                unit={t('common.units.m')}
                value={width}
                onChange={setWidth}
              />
              <NumberField
                label={t('project.wizard.dimensions.height')}
                unit={t('common.units.m')}
                value={height}
                onChange={setHeight}
              />
              <NumberField
                label={t('project.wizard.dimensions.doors')}
                value={doors}
                onChange={setDoors}
                step={1}
              />
              <NumberField
                label={t('project.wizard.dimensions.windows')}
                value={windows}
                onChange={setWindows}
                step={1}
              />
            </div>
            {dimensionResults ? (
              <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
                <p>
                  {t('project.wizard.dimensions.computedArea')}:{' '}
                  <strong>{dimensionResults.area.toFixed(2)} m²</strong>
                </p>
                <p>
                  {t('project.wizard.dimensions.computedPerimeter')}:{' '}
                  <strong>{dimensionResults.perimeter.toFixed(2)} m</strong>
                </p>
                {dimensionResults.wallArea !== undefined ? (
                  <p>
                    {t('project.wizard.dimensions.computedWallArea')}:{' '}
                    <strong>{dimensionResults.wallArea.toFixed(2)} m²</strong>
                  </p>
                ) : null}
                <p className="text-xs text-slate-500">
                  {t('project.wizard.dimensions.autoCalculated')}
                </p>
              </div>
            ) : null}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="label !mb-0">
                  {t('project.wizard.dimensions.rooms')}
                </label>
                <button type="button" className="btn-secondary" onClick={addRoom}>
                  {t('project.wizard.dimensions.addRoom')}
                </button>
              </div>
              <div className="space-y-2">
                {rooms.map((room) => (
                  <div key={room.id} className="flex gap-2">
                    <input
                      className="input"
                      placeholder={t('project.wizard.dimensions.roomName')}
                      value={room.name}
                      onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                    />
                    <input
                      className="input w-28"
                      type="number"
                      placeholder={t('project.wizard.dimensions.roomArea')}
                      value={room.area || ''}
                      onChange={(e) =>
                        updateRoom(room.id, { area: Number(e.target.value) || 0 })
                      }
                    />
                    <button
                      type="button"
                      className="btn-ghost text-red-600"
                      onClick={() => removeRoom(room.id)}
                    >
                      {t('common.actions.remove')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 'method' && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('project.wizard.method.description')}
            </p>
            <div className="grid gap-2">
              {constructionMethods.map((m) => (
                <label
                  key={m.id}
                  className={`card cursor-pointer !p-3 ${
                    methodId === m.id ? 'ring-2 ring-brand-500' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    className="mr-2"
                    checked={methodId === m.id}
                    onChange={() => setMethodId(m.id)}
                  />
                  {t(m.nameKey)}
                </label>
              ))}
            </div>
            <div>
              <label className="label">{t('project.wizard.finishLevel.label')}</label>
              <select
                className="input"
                value={finishLevel}
                onChange={(e) => setFinishLevel(e.target.value as FinishLevel)}
              >
                {FINISH_LEVELS.map((f) => (
                  <option key={f} value={f}>
                    {t(`project.wizard.finishLevel.${f}`)}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {step === 'review' && (
          <>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              {t('project.wizard.review.title')}
            </h2>
            <dl className="space-y-1 text-sm">
              <Row label={t('project.wizard.info.name')} value={name} />
              <Row label={t('project.wizard.info.location')} value={location || '—'} />
              <Row
                label={t('project.wizard.dimensions.area')}
                value={dimensionResults ? `${dimensionResults.area.toFixed(2)} m²` : '—'}
              />
              <Row
                label={t('project.wizard.method.title')}
                value={
                  constructionMethods.find((m) => m.id === methodId)
                    ? t(constructionMethods.find((m) => m.id === methodId)!.nameKey)
                    : '—'
                }
              />
            </dl>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="btn-secondary"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
        >
          {t('common.actions.back')}
        </button>
        {step === 'review' ? (
          <button type="button" className="btn-primary" onClick={handleFinish}>
            {t('project.wizard.review.confirm')}
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            disabled={!canGoNext}
            onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
          >
            {t('common.actions.next')}
          </button>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1 dark:border-slate-800">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-900 dark:text-white">{value}</dd>
    </div>
  );
}
