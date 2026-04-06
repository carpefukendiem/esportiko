"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectField<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  description,
  options,
}: {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  description?: string;
  options: { value: string; label: string }[];
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
          <Select
            value={field.value ? String(field.value) : undefined}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={id}
              error={!!fieldState.error}
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.error
                  ? `${id}-err`
                  : description
                    ? `${id}-desc`
                    : undefined
              }
            >
              <SelectValue placeholder={placeholder ?? "Select…"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
