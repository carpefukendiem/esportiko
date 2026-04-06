"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxField<T extends FieldValues>({
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
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id={id}
              checked={!!field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.error
                  ? `${id}-err`
                  : description
                    ? `${id}-desc`
                    : undefined
              }
            />
            <div>
              <Label htmlFor={id} error={!!fieldState.error}>
                {label}
              </Label>
              {description ? (
                <p id={`${id}-desc`} className="mt-1 text-body-sm text-gray-soft">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {fieldState.error ? (
            <p id={`${id}-err`} className="text-body-sm text-error" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
