import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureAccount } from "@/lib/portal/ensureAccount";
import type { DesignElement } from "@/lib/customize/design-types";

type SavedDesignRow = {
  id: string;
  name: string;
  garment_category: string | null;
  garment_style_number: string | null;
  garment_color: string | null;
  view_mode: string;
  elements: DesignElement[];
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
};

export default async function PortalDesignsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const account = await ensureAccount(supabase, user.id, user.email ?? undefined);
  if (!account) return null;

  const { data, error } = await supabase
    .from("saved_designs")
    .select("*")
    .eq("account_id", account.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <p className="font-sans text-sm font-medium text-red-400">Could not load saved designs.</p>
    );
  }

  const rows = (data ?? []) as SavedDesignRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Saved Designs</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#8A94A6]">
          Open a design in the composer to keep editing, or start a new one from{" "}
          <Link className="font-semibold text-[#3B7BF8] hover:underline" href="/customize">
            /customize
          </Link>
          .
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-8 text-sm text-[#8A94A6]">
          You haven&apos;t saved any designs yet. Use the composer to create one, then click Save Design.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((d) => (
            <div
              key={d.id}
              className="overflow-hidden rounded-xl border border-[#2A3347] bg-[#1C2333]"
            >
              <div className="aspect-[4/3] w-full bg-[#0F1521]">
                {d.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#8A94A6]">
                    No preview
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <p className="truncate font-display text-base font-semibold text-white">{d.name}</p>
                <p className="truncate text-xs text-[#8A94A6]">
                  {(d.garment_category ?? "").replaceAll("-", " ")} · {d.garment_style_number ?? "—"} ·{" "}
                  {d.garment_color ?? "—"}
                </p>
                <p className="text-[10px] text-[#8A94A6]">
                  Updated {new Date(d.updated_at).toLocaleString()}
                </p>
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/customize?design=${encodeURIComponent(d.id)}`}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#3B7BF8] px-3 py-2 text-center text-xs font-semibold text-white hover:opacity-90"
                  >
                    Open in composer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
