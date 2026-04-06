"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RadioGroupField<T extends FieldValues>({
  name,
  label,
  control,
  description,
  options,
}: {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  description?: string;
  options: { value: string; label: string }[];
}) {
  const id = String(name);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <fieldset className="space-y-3">
          <legend
            className={
              fieldState.error
                ? "font-sans text-label font-medium uppercase tracking-wider text-error"
                : "font-sans text-label font-medium uppercase tracking-wider text-gray-soft"
            }
          >
            {label}
          </legend>
          {description ? (
            <p id={`${id}-desc`} className="text-body-sm text-gray-soft">
              {description}
            </p>
          ) : null}
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid gap-3"
            aria-invalid={fieldState.invalid}
            aria-describedby={
              fieldState.error
                ? `${id}-err`
                : description
                  ? `${id}-desc`
                  : undefined
            }
          >
            {options.map((o) => (
              <label
                key={o.value}
                htmlFor={`${id}-${o.value}`}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-slate bg-navy-light px-3 py-3 hover:border-blue-accent/50"
              >
                <RadioGroupItem value={o.value} id={`${id}-${o.value}`} />
                <span className="font-sans text-body text-off-white">
                  {o.label}
                </span>
              </label>
            ))}
          </RadioGroup>
          {fieldState.error ? (
            <p id={`${id}-err`} className="text-body-sm text-error" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </fieldset>
      )}
    />
  );
}
