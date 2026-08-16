"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { registerArtworkAsset } from "@/lib/actions/portal";
import type { ArtworkAssetRow } from "@/types/portal";
import { DeleteArtworkForm } from "@/components/portal/DeleteArtworkForm";
import { ArtworkUploader } from "@/components/portal/ArtworkUploader";

type AssetWithUrl = ArtworkAssetRow & { signedUrl: string | null };

export function ArtworkManager({
  accountId,
  initialAssets,
}: {
  accountId: string;
  initialAssets: AssetWithUrl[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      let failed = 0;
      for (const file of files) {
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
      if (failed) setError(`${failed} file(s) could not be uploaded.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const isRaster = (name: string) => /\.(png|jpg|jpeg|webp|svg)$/i.test(name);

  return (
    <div className="space-y-6">
      <ArtworkUploader accountId={accountId} />

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer rounded-lg border border-[#2A3347] bg-[#0F1521] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8] hover:text-white">
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg,.webp"
            multiple
            disabled={uploading}
            onChange={(ev) => void onUpload(ev)}
          />
          {uploading ? "Uploading…" : "Add more files"}
        </label>
        {error ? (
          <p className="font-sans text-sm font-medium text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialAssets.map((a) => (
          <li
            key={a.id}
            className="flex flex-col rounded-xl border border-[#2A3347] bg-[#1C2333] p-4"
          >
            <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg border border-[#2A3347] bg-[#0F1521]">
              {a.signedUrl && isRaster(a.filename ?? a.storage_path) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.signedUrl}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="font-sans text-xs font-medium text-[#8A94A6]">
                  File
                </span>
              )}
            </div>
            <p className="truncate font-sans text-sm font-semibold text-white">
              {a.filename ?? a.storage_path.split("/").pop()}
            </p>
            <p className="mt-1 font-sans text-xs font-medium text-[#8A94A6]">
              {new Date(a.created_at).toLocaleString()}
            </p>
            <DeleteArtworkForm assetId={a.id} />
          </li>
        ))}
      </ul>

      {initialAssets.length === 0 && (
        <p className="font-sans text-sm font-medium text-[#8A94A6]">
          No files yet. Upload vector or raster artwork for your orders and fan shop previews.
        </p>
      )}
    </div>
  );
}
