'use client';
import {
  CheckboxesField,
  NumberField,
  SelectField,
  TextField,
  ToggleField,
  type CheckboxesFieldProps,
  type NumberFieldProps,
  type SelectFieldProps,
  type TextFieldProps,
  type ToggleFieldProps,
} from './fields';

/** Un campo descrito como dato: `type` elige el componente y el resto son sus props */
export type FieldConfig =
  | TextFieldProps
  | ({ type: 'textarea' } & Omit<TextFieldProps, 'type'>)
  | ({ type: 'number' } & NumberFieldProps)
  | ({ type: 'select' } & SelectFieldProps)
  | ({ type: 'toggle' } & ToggleFieldProps)
  | ({ type: 'checkboxes' } & CheckboxesFieldProps);

type Props = {
  fields: FieldConfig[];
  /** Deshabilita todos los campos (p. ej. mientras se guarda) */
  disabled?: boolean;
  /** Acomodo de los campos; cada campo puede traer su className (p. ej. sm:col-span-2) */
  className?: string;
};

function renderField(field: FieldConfig) {
  switch (field.type) {
    case 'textarea':
      return <TextField {...field} type="text" rows={field.rows ?? 4} />;
    case 'number':
      return <NumberField {...field} />;
    case 'select':
      return <SelectField {...field} />;
    case 'toggle':
      return <ToggleField {...field} />;
    case 'checkboxes':
      return <CheckboxesField {...field} />;
    default:
      return <TextField {...field} />;
  }
}

/**
 * Pinta un formulario a partir de una lista de campos. Va dentro de un <FormProvider> de react-hook-form;
 * para campos especiales, mezcla FormFieldset con los componentes de ./fields o con los tuyos.
 */
export default function FormFieldset({ fields, disabled, className = 'grid gap-x-4 sm:grid-cols-2' }: Props) {
  return (
    <fieldset disabled={disabled} className={`min-w-0 ${className}`}>
      {fields.map((field) => (
        <div key={field.name} className={field.className}>
          {renderField({ ...field, className: undefined })}
        </div>
      ))}
    </fieldset>
  );
}
