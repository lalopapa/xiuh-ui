'use client';
import { useId, type ReactNode } from 'react';
import { Controller, get, useFormContext, useWatch, type RegisterOptions } from 'react-hook-form';

// Textos de validación en un solo lugar: tradúcelos aquí o pasa mensajes propios en `rules`
export const FIELD_MESSAGES = {
  required: 'Este campo es obligatorio',
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  min: (min: number) => `El mínimo es ${min}`,
  max: (max: number) => `El máximo es ${max}`,
  email: 'Escribe un correo válido',
  integer: 'Escribe un número entero',
};

/** Mensaje de error del campo (validación del cliente, resolver de zod/yup o setError con lo que devolvió el back) */
export function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name);
  return typeof error?.message === 'string' && error.message ? error.message : undefined;
}

type FieldShellProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  counter?: ReactNode;
  help?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

/** Marco común de un campo: etiqueta, contador opcional, ayuda y error */
export function FieldShell({ label, htmlFor, required, counter, help, error, className = '', children }: FieldShellProps) {
  return (
    <fieldset className={`fieldset min-w-0 ${className}`}>
      <legend className="fieldset-legend flex w-full justify-between gap-2">
        <label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
        {counter && <span className="font-normal text-base-content/60">{counter}</span>}
      </legend>
      {children}
      {help && !error && <p className="label whitespace-normal">{help}</p>}
      {error && (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Counter({ name, max }: { name: string; max: number }) {
  const value = useWatch({ name });
  const length = typeof value === 'string' ? value.length : 0;
  return (
    <span className={length > max ? 'text-error' : undefined}>
      {length}/{max}
    </span>
  );
}

type BaseProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  help?: string;
  className?: string;
  /** Reglas extra de react-hook-form (se combinan con las de required, maxLength, etc.) */
  rules?: RegisterOptions;
};

export type TextFieldProps = BaseProps & {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local';
  placeholder?: string;
  maxLength?: number;
  showCounter?: boolean;
  /** Si se indica, el campo es un textarea con esas filas */
  rows?: number;
  autoComplete?: string;
};

export function TextField({ name, label, type = 'text', required, disabled, help, className, placeholder, maxLength, showCounter, rows, autoComplete, rules }: TextFieldProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = useId();
  // El cast evita la unión estricta de RegisterOptions (pattern vs. valueAsNumber) al combinar con `rules`
  const field = register(name, {
    required: required ? FIELD_MESSAGES.required : false,
    // Solo espacios no cuenta como lleno
    validate: required ? (v: unknown) => (typeof v !== 'string' || v.trim() ? true : FIELD_MESSAGES.required) : undefined,
    ...(maxLength ? { maxLength: { value: maxLength, message: FIELD_MESSAGES.maxLength(maxLength) } } : {}),
    ...(type === 'email' ? { pattern: { value: /^\S+@\S+\.\S+$/, message: FIELD_MESSAGES.email } } : {}),
    ...rules,
  } as RegisterOptions);
  const counter = showCounter && maxLength ? <Counter name={name} max={maxLength} /> : undefined;

  return (
    <FieldShell label={label} htmlFor={id} required={required} counter={counter} help={help} error={error} className={className}>
      {rows ? (
        <textarea id={id} rows={rows} className={`textarea w-full ${error ? 'textarea-error' : ''}`} placeholder={placeholder} disabled={disabled} aria-invalid={!!error} {...field} />
      ) : (
        <input
          id={id}
          type={type}
          className={`input w-full ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          {...field}
        />
      )}
    </FieldShell>
  );
}

const numberOrNull = (v: unknown) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v));

export type NumberFieldProps = BaseProps & {
  min?: number;
  max?: number;
  /** 1 (por defecto) solo acepta enteros; 0.01 para montos */
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
};

/** Número o null si está vacío */
export function NumberField({ name, label, required, disabled, help, className, min, max, step = 1, prefix, suffix, placeholder, rules }: NumberFieldProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = useId();
  const field = register(name, {
    setValueAs: numberOrNull,
    validate: (v: unknown) => {
      if (v == null) return required ? FIELD_MESSAGES.required : true;
      const n = Number(v);
      if (step >= 1 && !Number.isInteger(n)) return FIELD_MESSAGES.integer;
      if (min != null && n < min) return FIELD_MESSAGES.min(min);
      if (max != null && n > max) return FIELD_MESSAGES.max(max);
      return true;
    },
    ...rules,
  });

  return (
    <FieldShell label={label} htmlFor={id} required={required} help={help} error={error} className={className}>
      <label className={`input w-full ${error ? 'input-error' : ''}`}>
        {prefix && <span className="text-base-content/60">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode={step < 1 ? 'decimal' : 'numeric'}
          className="grow"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          {...field}
        />
        {suffix && <span className="text-base-content/60">{suffix}</span>}
      </label>
    </FieldShell>
  );
}

export type Option = { value: string; label: string };

export type SelectFieldProps = BaseProps & {
  options: Option[];
  /** Primera opción vacía (no se puede volver a elegir) */
  placeholder?: string;
};

export function SelectField({ name, label, required, disabled, help, className, options, placeholder = 'Elige una opción', rules }: SelectFieldProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = useId();
  const field = register(name, { required: required ? FIELD_MESSAGES.required : false, ...rules });

  return (
    <FieldShell label={label} htmlFor={id} required={required} help={help} error={error} className={className}>
      {/* defaultValue="": sin él el navegador salta la opción vacía (disabled) y elige la primera de la lista */}
      <select id={id} defaultValue="" className={`select w-full ${error ? 'select-error' : ''}`} disabled={disabled} aria-invalid={!!error} {...field}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export type ToggleFieldProps = Omit<BaseProps, 'required'>;

/** Interruptor booleano con la etiqueta a la izquierda */
export function ToggleField({ name, label, disabled, help, className = '', rules }: ToggleFieldProps) {
  const { register } = useFormContext();
  const id = useId();
  return (
    <fieldset className={`fieldset min-w-0 ${className}`}>
      <label htmlFor={id} className="label cursor-pointer justify-between gap-3 py-2 text-sm text-base-content">
        {label}
        <input id={id} type="checkbox" className="toggle toggle-primary" disabled={disabled} {...register(name, rules)} />
      </label>
      {help && <p className="label whitespace-normal">{help}</p>}
    </fieldset>
  );
}

export type CheckboxesFieldProps = BaseProps & { options: Option[] };

/** Varias opciones a la vez: el valor es un arreglo con los `value` elegidos */
export function CheckboxesField({ name, label, required, disabled, help, className, options, rules }: CheckboxesFieldProps) {
  const { control } = useFormContext();
  const error = useFieldError(name);
  return (
    <FieldShell label={label} required={required} help={help} error={error} className={className}>
      <Controller
        name={name}
        control={control}
        rules={{ validate: (v: unknown) => !required || (Array.isArray(v) && v.length > 0) || FIELD_MESSAGES.required, ...rules } as RegisterOptions}
        render={({ field }) => {
          const selected: string[] = Array.isArray(field.value) ? field.value : [];
          const toggle = (value: string) => field.onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
          return (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {options.map((option) => (
                <label key={option.value} className="label cursor-pointer gap-2 text-sm text-base-content">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                    checked={selected.includes(option.value)}
                    disabled={disabled}
                    onChange={() => toggle(option.value)}
                    onBlur={field.onBlur}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          );
        }}
      />
    </FieldShell>
  );
}
