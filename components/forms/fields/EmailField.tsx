"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { TextField } from "@/components/forms/fields/TextField";

export function EmailField<T extends FieldValues>(props: {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  description?: string;
}) {
  return (
    <TextField
      {...props}
      type="email"
      autoComplete="email"
      placeholder={props.placeholder ?? "you@example.com"}
    />
  );
}
