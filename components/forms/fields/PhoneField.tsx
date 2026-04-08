"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { TextField } from "@/components/forms/fields/TextField";

export function PhoneField<T extends FieldValues>(props: {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  description?: string;
}) {
  return (
    <TextField
      {...props}
      type="tel"
      autoComplete="tel"
      placeholder={props.placeholder ?? "+1 805-335-2239"}
      description={
        props.description ??
        "Include area code. Digits and common separators are accepted."
      }
    />
  );
}
