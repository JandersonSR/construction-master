import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GeometryCalculator } from '../calculators/GeometryCalculator';
import { ConcreteCalculator } from '../calculators/ConcreteCalculator';
import { MasonryCalculator } from '../calculators/MasonryCalculator';
import { FlooringCalculator } from '../calculators/FlooringCalculator';
import { PaintCalculator } from '../calculators/PaintCalculator';
import { RoofCalculator } from '../calculators/RoofCalculator';
import { DeckCalculator } from '../calculators/DeckCalculator';
import { HydraulicCalculator } from '../calculators/HydraulicCalculator';
import { ElectricalCalculator } from '../calculators/ElectricalCalculator';
import { NetworkCalculator } from '../calculators/NetworkCalculator';
import { SolarCalculator } from '../calculators/SolarCalculator';
import { SolarHeatingCalculator } from '../calculators/SolarHeatingCalculator';
import { FinancialCalculator } from '../calculators/FinancialCalculator';

const CATEGORIES = [
  'geometry',
  'concrete',
  'masonry',
  'flooring',
  'paint',
  'roof',
  'deck',
  'hydraulic',
  'electrical',
  'network',
  'solar',
  'solarHeating',
  'financial',
] as const;
type Category = (typeof CATEGORIES)[number];

const CALCULATORS: Record<Category, () => JSX.Element> = {
  geometry: GeometryCalculator,
  concrete: ConcreteCalculator,
  masonry: MasonryCalculator,
  flooring: FlooringCalculator,
  paint: PaintCalculator,
  roof: RoofCalculator,
  deck: DeckCalculator,
  hydraulic: HydraulicCalculator,
  electrical: ElectricalCalculator,
  network: NetworkCalculator,
  solar: SolarCalculator,
  solarHeating: SolarHeatingCalculator,
  financial: FinancialCalculator,
};

export default function CalculatorsHubPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState<Category>('geometry');
  const Active = CALCULATORS[active];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('calculators.hub.title')}
      </h1>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={active === cat ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActive(cat)}
          >
            {t(`calculators.hub.categories.${cat}`)}
          </button>
        ))}
      </div>
      <Active />
    </div>
  );
}
