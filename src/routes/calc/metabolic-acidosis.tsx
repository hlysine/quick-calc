import { createFileRoute } from '@tanstack/react-router';
import CalcHeader from '../../components/calculator/CalcHeader';
import Calculator from '../../components/calculator/Calculator';
import CalcTab from '../../components/calculator/CalcTab';
import { useState } from 'react';
import {
  format,
  PressureUnit,
  PressureUnits,
  safeCompute,
} from '../../utils/types';
import CalcNumberInput from '../../components/calculator/CalcNumberInput';
import CalcOutputPanel from '../../components/calculator/CalcOutputPanel';
import CalcOutputEntry from '../../components/calculator/CalcOutputEntry';
import CalcDivider from '../../components/calculator/CalcDivider';
import CalcDescription from '../../components/calculator/CalcDescription';

function MetabolicAcidosis() {
  const [unit, setUnit] = useState<PressureUnit>('kPa');
  const [bicarbonate, setBicarbonate] = useState<number>(Number.NaN);

  const paCO2Min = safeCompute(
    bicarbonate => {
      if (unit === 'kPa') {
        return (1.5 * bicarbonate + 8 - 2) * 0.133;
      } else {
        return 1.5 * bicarbonate + 8 - 2;
      }
    },
    [bicarbonate]
  );
  const paCO2Max = safeCompute(
    bicarbonate => {
      if (unit === 'kPa') {
        return (1.5 * bicarbonate + 8 + 2) * 0.133;
      } else {
        return 1.5 * bicarbonate + 8 + 2;
      }
    },
    [bicarbonate]
  );

  return (
    <Calculator>
      <CalcHeader
        title="Metabolic acidosis"
        description={<CalcDescription descriptionKey="metabolic-acidosis" />}
      />
      <CalcTab
        options={PressureUnits}
        selected={unit}
        onSelect={newUnit => {
          if (newUnit !== unit) {
            setUnit(newUnit);
          }
        }}
      />
      <CalcDivider>Results</CalcDivider>
      <CalcOutputPanel>
        <CalcOutputEntry
          topLabel="Expected value of"
          prefix={
            <>
              P<sub>a</sub>CO<sub>2</sub>
            </>
          }
          value={
            <>
              {format(paCO2Min)} ~ {format(paCO2Max)}
            </>
          }
          suffix={unit === 'kPa' ? 'kPa' : 'mmHg'}
        />
      </CalcOutputPanel>
      <CalcDivider>Inputs</CalcDivider>
      <CalcNumberInput
        value={bicarbonate}
        onChange={value => setBicarbonate(value)}
        max={22}
        prefix="Bicarbonate"
        suffix="<22 mmol/L"
      />
    </Calculator>
  );
}

export const Route = createFileRoute('/calc/metabolic-acidosis')({
  component: MetabolicAcidosis,
});
