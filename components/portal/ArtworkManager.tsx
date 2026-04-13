"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserClientIfConfigured } from "@/lib/supabase/client";
import { registerArtworkAsset } from "@/lib/actions/portal";
import type { ArtworkAssetRow } from "@/types/portal";
import { DeleteArtworkForm } from "@/components/portal/DeleteArtworkForm";

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

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createBrowserClientIfConfigured();
      if (!supabase) {
        alert("Storage is not configured for this deployment.");
        return;
      }
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `accounts/${accountId}/artwork/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from("artwork").upload(path, file);
      if (error) {
        alert(error.message);
        return;
      }
      await registerArtworkAsset(safeName, path);
      router.refresh();
    } finally {
      setUploading(false);
    }
  };

  const isRaster = (name: string) => /\.(png|jpg|jpeg|webp)$/i.test(name);

  return (
    <div className="space-y-6">
      <div>
        <label className="inline-flex cursor-pointer rounded-lg bg-[#3B7BF8] px-4 py-2 font-sans text-sm font-semibold text-white hover:opacity-90">
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg"
            disabled={uploading}
            onChange={(ev) => void onUpload(ev)}
          />
          {uploading ? "Uploading…" : "Upload artwork"}
        </label>
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
            {a.signedUrl && (
              <input
                readOnly
                value={a.signedUrl}
                className="mt-2 w-full truncate rounded border border-[#2A3347] bg-[#0F1521] px-2 py-1 font-mono text-[10px] text-[#8A94A6]"
              />
            )}
            <DeleteArtworkForm assetId={a.id} />
          </li>
        ))}
      </ul>

      {initialAssets.length === 0 && (
        <p className="font-sans text-sm font-medium text-[#8A94A6]">
          No files yet. Upload vector or raster artwork for your orders.
        </p>
      )}
    </div>
  );
}
