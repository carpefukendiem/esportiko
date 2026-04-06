"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  description,
  rows = 4,
}: {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  description?: string;
  rows?: number;
}) {
  const id = String(name);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={id} error={!!fieldState.error}>
            {label}
          </Label>
          {description ? (
            <p id={`${id}-desc`} className="text-body-sm text-gray-soft">
              {description}
            </p>
          ) : null}
          <Textarea
            id={id}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            aria-describedby={
              fieldState.error
                ? `${id}-err`
                : description
                  ? `${id}-desc`
                  : undefined
            }
            error={!!fieldState.error}
            {...field}
            value={field.value ?? ""}
          />
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
