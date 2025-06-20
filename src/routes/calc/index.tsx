import { createFileRoute } from '@tanstack/react-router';
import CollapsibleSections from '../../components/CollapsibleSections';
import MouseDownLink from '../../components/MouseDownLink';

interface Calculator {
  title: string;
  badges: React.ReactNode[];
  path: string;
}

const calculators: Record<string, Calculator[]> = {
  'Neurological emergencies': [
    {
      title: 'Glasgow Coma Scale',
      badges: [],
      path: '/calc/glasgow-coma-scale',
    },
  ],
  'Arterial blood gas': [
    {
      title: 'A-a gradient',
      badges: [
        <span key="PaO2">
          P<sub>a</sub>O<sub>2</sub>
        </span>,
        <span key="FiO2">
          FiO<sub>2</sub>
        </span>,
        <span key="PaCO2">
          P<sub>a</sub>CO<sub>2</sub>
        </span>,
        'Age',
      ],
      path: '/calc/oxygen-gradient',
    },
    {
      title: 'Acute respiratory acidosis',
      badges: [
        <span key="PaCO2">
          P<sub>a</sub>CO<sub>2</sub>
        </span>,
      ],
      path: '/calc/acute-respiratory-acidosis',
    },
    {
      title: 'Acute respiratory alkalosis',
      badges: [
        <span key="PaCO2">
          P<sub>a</sub>CO<sub>2</sub>
        </span>,
      ],
      path: '/calc/acute-respiratory-alkalosis',
    },
    {
      title: 'Chronic respiratory acidosis',
      badges: [
        <span key="PaCO2">
          P<sub>a</sub>CO<sub>2</sub>
        </span>,
      ],
      path: '/calc/chronic-respiratory-acidosis',
    },
    {
      title: 'Chronic respiratory alkalosis',
      badges: [
        <span key="PaCO2">
          P<sub>a</sub>CO<sub>2</sub>
        </span>,
      ],
      path: '/calc/chronic-respiratory-alkalosis',
    },
    {
      title: 'Metabolic acidosis',
      badges: ['Bicarbonate'],
      path: '/calc/metabolic-acidosis',
    },
    {
      title: 'Metabolic alkalosis',
      badges: ['Bicarbonate'],
      path: '/calc/metabolic-alkalosis',
    },
  ],
  'Metabolic disturbances': [
    {
      title: 'Anion gap',
      badges: ['Sodium', 'Chloride', 'Bicarbonate'],
      path: '/calc/anion-gap',
    },
    {
      title: 'Corrected Sodium',
      badges: ['Sodium', 'Glucose'],
      path: '/calc/corrected-sodium',
    },
  ],
  'Acute respiratory failure': [
    {
      title: 'Peak expiratory flow rate',
      badges: ['Age', 'Height', 'Ethnicity'],
      path: '/calc/peak-flow-rate',
    },
  ],
};

function CalcIndex() {
  return (
    <div className="flex-1 w-full max-w-[1000px] self-center overflow-y-auto">
      <CollapsibleSections sections={calculators}>
        {entry => (
          <MouseDownLink
            to={entry.path}
            key={entry.title}
            className="flex flex-col gap-1 w-96 bg-base-200 text-base border-b border-neutral/30 py-3 px-6 hover:bg-base-300 transition-all cursor-pointer"
          >
            <h2 className="">{entry.title}</h2>
            {entry.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.badges.map((badge, idx) => (
                  <div key={idx} className="badge badge-secondary badge-sm">
                    {badge}
                  </div>
                ))}
              </div>
            )}
          </MouseDownLink>
        )}
      </CollapsibleSections>
    </div>
  );
}

export const Route = createFileRoute('/calc/')({
  component: CalcIndex,
});
