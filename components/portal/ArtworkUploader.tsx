"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { registerArtworkAsset } from "@/lib/actions/portal";
import { cn } from "@/lib/utils/cn";

type Props = {
  accountId: string;
  compact?: boolean;
  className?: string;
};

export function ArtworkUploader({ accountId, compact = false, className }: Props) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(Boolean);
    if (!list.length) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();
    let failed = 0;

    try {
      for (const file of list) {
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `accounts/${accountId}/artwork/${crypto.randomUUID()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("artwork").upload(path, file);
        if (upErr) {
          failed += 1;
          continue;
        }
        await registerArtworkAsset(safeName, path);
      }
      router.refresh();
      if (failed > 0) {
        setError(`${failed} file(s) failed to upload. Check format and try again.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) void uploadFiles(files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
  };

  if (compact) {
    return (
      <div className={className}>
        <label className="inline-flex cursor-pointer rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90">
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg,.webp"
            multiple
            disabled={uploading}
            onChange={(ev) => void onInputChange(ev)}
          />
          {uploading ? "Uploading…" : "Upload logos"}
        </label>
        {error ? (
          <p className="mt-2 font-sans text-xs font-medium text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragOver
            ? "border-[#3B7BF8] bg-[#3B7BF8]/10"
            : "border-[#2A3347] bg-[#1C2333]"
        )}
      >
        <p className="font-sans text-sm font-medium text-white">
          Drop multiple logos or images here
        </p>
        <p className="mt-1 font-sans text-xs text-[#8A94A6]">
          PNG, JPG, SVG, PDF, AI, EPS — private to your team
        </p>
        <label className="mt-4 inline-flex cursor-pointer rounded-lg bg-[#3B7BF8] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90">
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg,.webp"
            multiple
            disabled={uploading}
            onChange={(ev) => void onInputChange(ev)}
          />
          {uploading ? "Uploading…" : "Choose files"}
        </label>
      </div>
      {error ? (
        <p className="font-sans text-sm font-medium text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <p className="font-sans text-xs text-[#8A94A6]">
        Manage all files in{" "}
        <Link href="/portal/artwork" className="font-semibold text-[#3B7BF8] hover:underline">
          Artwork library
        </Link>
        .
      </p>
    </div>
  );
}
