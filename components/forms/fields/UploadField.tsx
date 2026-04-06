"use client";

import { useRef, useState } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const ACCEPT =
  ".ai,.eps,.pdf,.png,.jpg,.jpeg,.svg,application/postscript,application/pdf,image/png,image/jpeg,image/svg+xml";

const MAX_BYTES = 20 * 1024 * 1024;

function normalizeFiles(list: FileList | File[] | null): File[] {
  if (!list || (list as FileList).length === 0) return [];
  const arr = Array.from(list as FileList);
  const out: File[] = [];
  for (let i = 0; i < arr.length; i++) {
    const f = arr[i];
    if (f.size > MAX_BYTES) continue;
    out.push(f);
  }
  return out;
}

function mergeFiles(existing: File[], incoming: File[]): File[] {
  const key = (f: File) => `${f.name}:${f.size}`;
  const seen = new Set(existing.map(key));
  const next = [...existing];
  for (const f of incoming) {
    const k = key(f);
    if (!seen.has(k)) {
      seen.add(k);
      next.push(f);
    }
  }
  return next;
}

function UploadDropZone({
  id,
  error,
  inputRef,
  onPickClick,
  onAddFiles,
}: {
  id: string;
  error: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onPickClick: () => void;
  onAddFiles: (files: File[]) => void;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPickClick();
        }
      }}
      onClick={onPickClick}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOver(false);
        const added = normalizeFiles(e.dataTransfer.files);
        if (added.length) onAddFiles(added);
      }}
      className={cn(
        "flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate bg-navy-light/60 px-4 py-6 text-center transition-colors hover:border-blue-accent/60",
        over && "border-blue-accent bg-blue-muted/20",
        error && "border-error"
      )}
    >
      <Upload className="h-8 w-8 text-blue-accent" aria-hidden />
      <span className="font-sans text-body-sm text-gray-soft">
        Drag and drop files here, or click to browse
      </span>
      <input
        id={`${id}-input`}
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPT}
        multiple
        onChange={(e) => {
          const added = normalizeFiles(e.target.files);
          e.target.value = "";
          if (added.length) onAddFiles(added);
        }}
      />
    </div>
  );
}

export function UploadField<T extends FieldValues>({
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
  const inputRef = useRef<HTMLInputElement>(null);
  const id = String(name);

  const formatSize = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const files: File[] = field.value
          ? Array.isArray(field.value)
            ? field.value
            : [field.value]
          : [];

        const addFiles = (incoming: File[]) => {
          const merged = mergeFiles(files, incoming);
          field.onChange(merged.length ? merged : undefined);
        };

        return (
          <div className="space-y-2">
            <Label htmlFor={`${id}-input`} error={!!fieldState.error}>
              {label}
            </Label>
            <p id={`${id}-desc`} className="text-body-sm text-gray-soft">
              {description ??
                "Accepted: AI, EPS, PDF, PNG, JPG, SVG. Max 20MB."}
            </p>
            <UploadDropZone
              id={id}
              error={!!fieldState.error}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
              onPickClick={() => inputRef.current?.click()}
              onAddFiles={addFiles}
            />
            {files.length > 0 ? (
              <ul
                className="space-y-2 rounded-xl border border-slate bg-navy-mid p-3"
                aria-live="polite"
              >
                {files.map((f) => (
                  <li
                    key={`${f.name}-${f.size}`}
                    className="flex items-center justify-between gap-2 text-body-sm text-off-white"
                  >
                    <span className="truncate">
                      {f.name}{" "}
                      <span className="text-gray-soft">({formatSize(f.size)})</span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="shrink-0 px-2"
                      aria-label={`Remove ${f.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const filtered = files.filter((x) => x !== f);
                        field.onChange(filtered.length ? filtered : undefined);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
            {fieldState.error ? (
              <p className="text-body-sm text-error" role="alert">
                {fieldState.error.message}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
