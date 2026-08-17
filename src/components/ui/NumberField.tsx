import { useId } from 'react';

interface NumberFieldProps {
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  unit?: string;
  min?: number;
  step?: number;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

/**
 * Campo numérico com validação amigável. Nunca deixa o app quebrar com
 * texto/vazio/negativo — apenas propaga `''` até que o usuário digite um
 * número válido, e exibe `error` vindo da validação do motor de cálculo.
 */
export function NumberField({
  label,
  value,
  onChange,
  unit,
  min = 0,
  step = 0.01,
  placeholder,
  error,
  helperText,
}: NumberFieldProps) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {unit ? <span className="text-slate-400"> ({unit})</span> : null}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        className="input"
        min={min}
        step={step}
        placeholder={placeholder}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') {
            onChange('');
            return;
          }
          const parsed = Number(raw);
          onChange(Number.isNaN(parsed) ? '' : parsed);
        }}
      />
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
