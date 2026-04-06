"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SwitchField<T extends FieldValues>({
  name,
  label,
  control,
  description,
}: {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  description?: string;
}) {
  const id = String(name);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2 rounded-xl border border-slate bg-navy-light/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label htmlFor={id} error={!!fieldState.error}>
              {label}
            </Label>
            {description ? (
              <p id={`${id}-desc`} className="mt-1 max-w-prose text-body-sm text-gray-soft">
                {description}
              </p>
            ) : null}
          </div>
          <Switch
            id={id}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
            aria-describedby={
              fieldState.error
                ? `${id}-err`
                : description
                  ? `${id}-desc`
                  : undefined
            }
          />
          {fieldState.error ? (
            <p id={`${id}-err`} className="sr-only" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
