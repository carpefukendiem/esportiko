"use client";

import { useRouter } from "next/navigation";
import { removeArtworkAsset } from "@/lib/actions/portal";

export function DeleteArtworkForm({ assetId }: { assetId: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() =>
        void (async () => {
          await removeArtworkAsset(assetId);
          router.refresh();
        })()
      }
      className="mt-3 w-full rounded-lg border border-red-500/60 py-2 font-sans text-xs font-semibold text-red-400 hover:bg-[#0F1521]"
    >
      Delete
    </button>
  );
}
