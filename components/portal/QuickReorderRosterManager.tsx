"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { updateDraftRoster } from "@/lib/actions/portal";
import type { DefaultRosterJson, OrderItemRow } from "@/types/portal";
import { cn } from "@/lib/utils/cn";

export type QuickReorderRosterFormValues = {
  roster: Array<{
    id: string;
    player_name?: string;
    player_number?: string;
    size?: string;
    quantity: number;
  }>;
};

function newRowId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random());
}

function draftItemsToForm(items: OrderItemRow[]): QuickReorderRosterFormValues["roster"] {
  return items.map((i) => ({
    id: i.id,
    player_name: i.player_name ?? "",
    player_number: i.player_number ?? "",
    size: i.size ?? "",
    quantity: i.quantity,
  }));
}

function defaultRosterToForm(roster: DefaultRosterJson): QuickReorderRosterFormValues["roster"] {
  return roster.map((p) => ({
    id: newRowId(),
    player_name: p.name,
    player_number: p.number,
    size: p.preferred_size,
    quantity: 1,
  }));
}

function mapFormToPayload(values: QuickReorderRosterFormValues["roster"]) {
  return values.map(({ player_name, player_number, size, quantity }) => ({
    player_name,
    player_number,
    size,
    quantity,
  }));
}

function debounce<F extends (...a: Parameters<F>) => void>(fn: F, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function getChangeClass(
  newItem: QuickReorderRosterFormValues["roster"][number] | undefined,
  originalItem: OrderItemRow | undefined
): string {
  if (!newItem) return "";
  if (!originalItem) return "bg-green-500/10";

  const changed =
    (newItem.player_name ?? "").trim() !== (originalItem.player_name ?? "").trim() ||
    (newItem.player_number ?? "").trim() !== (originalItem.player_number ?? "").trim() ||
    (newItem.size ?? "").trim() !== (originalItem.size ?? "").trim() ||
    Number(newItem.quantity) !== Number(originalItem.quantity);

  return changed ? "bg-blue-500/10" : "";
}

const cellInputClass =
  "min-w-0 border-0 bg-transparent text-sm text-white placeholder:text-[#5C6578] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]";

export function QuickReorderRosterManager({
  orderId,
  draftItems,
  originalItems,
  accountDefaultRoster,
}: {
  orderId: string;
  draftItems: OrderItemRow[];
  originalItems: OrderItemRow[];
  accountDefaultRoster: DefaultRosterJson | null;
}) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const programmaticRef = useRef(false);
  const firstRunRef = useRef(true);

  const defaultValues = useMemo(
    () => ({
      roster:
        draftItems.length > 0
          ? draftItemsToForm(draftItems)
          : [{ id: newRowId(), player_name: "", player_number: "", size: "", quantity: 1 }],
    }),
    [draftItems]
  );

  const form = useForm<QuickReorderRosterFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "roster",
  });

  const persist = useCallback(async () => {
    const roster = mapFormToPayload(form.getValues("roster"));
    setSaveStatus("saving");
    try {
      await updateDraftRoster(orderId, roster);
      setSaveStatus("saved");
      window.setTimeout(() => setSaveStatus("idle"), 1200);
    } catch {
      setSaveStatus("idle");
    }
  }, [form, orderId]);

  const debouncedPersist = useMemo(() => debounce(() => void persist(), 500), [persist]);

  const autosaveDraft = useCallback(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    if (programmaticRef.current) {
      programmaticRef.current = false;
      return;
    }
    debouncedPersist();
  }, [debouncedPersist]);

  const resetToOriginal = () => {
    programmaticRef.current = true;
    replace(
      originalItems.length > 0
        ? originalItems.map((i) => ({
            id: newRowId(),
            player_name: i.player_name ?? "",
            player_number: i.player_number ?? "",
            size: i.size ?? "",
            quantity: i.quantity,
          }))
        : [{ id: newRowId(), player_name: "", player_number: "", size: "", quantity: 1 }]
    );
    void persist();
  };

  const loadDefaultRoster = () => {
    if (!accountDefaultRoster?.length) return;
    programmaticRef.current = true;
    replace(defaultRosterToForm(accountDefaultRoster));
    void persist();
  };

  const addPlayer = () => {
    append({
      id: newRowId(),
      player_name: "",
      player_number: "",
      size: "",
      quantity: 1,
    });
  };

  const rosterValues = form.watch("roster");
  useEffect(() => {
    autosaveDraft();
  }, [rosterValues, autosaveDraft]);

  const hasOriginal = originalItems.length > 0;
  const hasDefault = Boolean(accountDefaultRoster && accountDefaultRoster.length > 0);

  return (
    <div className="rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-sans text-lg font-semibold text-white">Roster</h2>
          <p className="mt-1 font-sans text-xs text-[#8A94A6]" aria-live="polite">
            {saveStatus === "saving" && "Saving…"}
            {saveStatus === "saved" && "Saved"}
            {saveStatus === "idle" && "\u00a0"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasOriginal && (
            <button type="button" onClick={resetToOriginal} className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8] hover:text-[#3B7BF8]">
              Keep original roster
            </button>
          )}
          {hasDefault && (
            <button type="button" onClick={loadDefaultRoster} className="rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8] hover:text-[#3B7BF8]">
              Load default roster
            </button>
          )}
        </div>
      </div>

      <div className={cn("mt-6 grid gap-6", hasOriginal ? "lg:grid-cols-2" : "")}>
        {hasOriginal && (
          <div className="min-w-0">
            <h3 className="font-sans text-xs font-medium uppercase text-[#8A94A6]">Previous roster</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[260px] text-left">
                <thead>
                  <tr className="border-b border-[#2A3347]">
                    <th className="pb-2 pr-3 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Player</th>
                    <th className="pb-2 pr-3 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">#</th>
                    <th className="pb-2 pr-3 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Size</th>
                    <th className="pb-2 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {originalItems.map((item) => (
                    <tr key={item.id} className="border-b border-[#2A3347] last:border-0">
                      <td className="py-2 pr-3 font-sans text-sm text-white">{item.player_name || "—"}</td>
                      <td className="py-2 pr-3 font-sans text-sm text-[#8A94A6]">{item.player_number || "—"}</td>
                      <td className="py-2 pr-3 font-sans text-sm text-[#8A94A6]">{item.size || "—"}</td>
                      <td className="py-2 font-sans text-sm text-[#8A94A6]">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="min-w-0">
          <h3 className="font-sans text-xs font-medium uppercase text-[#8A94A6]">
            {hasOriginal ? "New roster" : "Roster"}
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[300px] text-left">
              <thead>
                <tr className="border-b border-[#2A3347]">
                  <th className="pb-2 pr-2 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Player</th>
                  <th className="pb-2 pr-2 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">#</th>
                  <th className="pb-2 pr-2 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Size</th>
                  <th className="pb-2 pr-2 text-left font-sans text-xs font-medium uppercase text-[#8A94A6]">Qty</th>
                  <th className="pb-2 w-14" />
                </tr>
              </thead>
              <tbody>
                {fields.map((field, idx) => (
                  <tr key={field.id} className={cn("border-b border-[#2A3347] last:border-0", getChangeClass(rosterValues?.[idx], originalItems[idx]))}>
                    <td className="py-1 pr-2 align-middle">
                      <input {...form.register(`roster.${idx}.player_name`)} onBlur={() => autosaveDraft()} aria-label={`Player name ${idx + 1}`} className={cn(cellInputClass, "w-full")} />
                    </td>
                    <td className="py-1 pr-2 align-middle">
                      <input {...form.register(`roster.${idx}.player_number`)} onBlur={() => autosaveDraft()} aria-label={`Player number ${idx + 1}`} className={cn(cellInputClass, "w-12")} />
                    </td>
                    <td className="py-1 pr-2 align-middle">
                      <input {...form.register(`roster.${idx}.size`)} onBlur={() => autosaveDraft()} aria-label={`Size ${idx + 1}`} className={cn(cellInputClass, "w-20")} />
                    </td>
                    <td className="py-1 pr-2 align-middle">
                      <input type="number" min={1} {...form.register(`roster.${idx}.quantity`, { valueAsNumber: true })} onBlur={() => autosaveDraft()} aria-label={`Quantity ${idx + 1}`} className={cn(cellInputClass, "w-14")} />
                    </td>
                    <td className="py-1 align-middle">
                      <button type="button" onClick={() => remove(idx)} className="font-sans text-xs text-red-400 hover:text-red-300">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addPlayer} className="mt-4 rounded-lg border border-[#2A3347] px-4 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8] hover:text-[#3B7BF8]">
            + Add player
          </button>
        </div>
      </div>
    </div>
  );
}
