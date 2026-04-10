"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import {
  portalOrderFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  type PortalOrderFormValues,
} from "@/lib/schemas/portalOrderFormSchema";
import {
  savePortalDraft,
  submitPortalOrder,
  registerArtworkAsset,
} from "@/lib/actions/portal";
import type { AccountRow, ArtworkAssetRow, OrderItemRow, OrderRow } from "@/types/portal";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils/cn";

const GARMENTS = [
  "Jerseys",
  "Hoodies",
  "T-Shirts",
  "Polos",
  "Hats",
  "Other",
] as const;
const DECORATIONS = ["Screen Print", "Embroidery", "Both"] as const;

function seasonChoices(): string[] {
  const y = new Date().getFullYear();
  const years = [y, y + 1, y + 2];
  const seasons = ["Spring", "Summer", "Fall", "Winter"];
  return seasons.flatMap((s) => years.map((year) => `${s} ${year}`));
}

function parseNotes(order: OrderRow): { base?: string; color?: string } {
  const n = order.notes ?? "";
  const idx = n.indexOf("Color / design:");
  if (idx === -1) return { base: n || undefined };
  return {
    base: n.slice(0, idx).trim() || undefined,
    color: n.slice(idx + "Color / design:".length).trim() || undefined,
  };
}

function buildDefaults(
  account: AccountRow,
  order: OrderRow,
  items: OrderItemRow[]
): PortalOrderFormValues {
  const { base, color } = parseNotes(order);
  const fromDefault =
    items.length === 0 &&
    account.use_default_roster_for_new_orders &&
    Array.isArray(account.default_roster) &&
    account.default_roster.length > 0
      ? account.default_roster.map((p) => ({
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : String(Math.random()),
          player_name: p.name,
          player_number: p.number,
          size: p.preferred_size,
          quantity: 1,
        }))
      : items.map((i) => ({
          id: i.id,
          player_name: i.player_name ?? "",
          player_number: i.player_number ?? "",
          size: i.size ?? "",
          quantity: i.quantity,
        }));

  return {
    team_name: account.team_name,
    sport: account.sport ?? "",
    season: order.season ?? seasonChoices()[0] ?? "Spring " + new Date().getFullYear(),
    deadline: order.deadline ?? "",
    garment_type: order.garment_type ?? "",
    decoration_method: order.decoration_method ?? "",
    quantity: order.quantity ?? 1,
    color_notes: color ?? "",
    roster: fromDefault,
    roster_skip: order.roster_incomplete === true && fromDefault.length === 0,
    artwork_url: order.artwork_url ?? "",
    artwork_deferred: order.artwork_deferred === true,
    notes: base ?? "",
  };
}

export function OrderForm({
  orderId,
  account,
  order,
  items,
  artworkAssets,
}: {
  orderId: string;
  account: AccountRow;
  order: OrderRow;
  items: OrderItemRow[];
  artworkAssets: ArtworkAssetRow[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const seasons = useMemo(() => seasonChoices(), []);

  const form = useForm<PortalOrderFormValues>({
    defaultValues: buildDefaults(account, order, items),
    mode: "onBlur",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "roster",
  });

  const rosterSkip = form.watch("roster_skip");
  const artworkDeferred = form.watch("artwork_deferred");

  const validateAndSaveStep = async (nextStep: number) => {
    setStepError(null);
    const v = form.getValues();
    if (step === 0) {
      const r = step1Schema.safeParse(v);
      if (!r.success) {
        setStepError(r.error.issues[0]?.message ?? "Check highlighted fields");
        return;
      }
    }
    if (step === 1) {
      const r = step2Schema.safeParse({
        roster: v.roster,
        roster_skip: v.roster_skip,
      });
      if (!r.success) {
        setStepError(r.error.issues[0]?.message ?? "Fix roster");
        return;
      }
    }
    if (step === 2) {
      const r = step3Schema.safeParse({
        artwork_url: v.artwork_url,
        artwork_deferred: v.artwork_deferred,
      });
      if (!r.success) {
        setStepError(r.error.issues[0]?.message ?? "Artwork step incomplete");
        return;
      }
    }

    try {
      await savePortalDraft(orderId, v);
      setStep(nextStep);
    } catch (e) {
      console.error(e);
      setStepError("Could not save draft. Try again.");
    }
  };

  const onNext = () => void validateAndSaveStep(step + 1);
  const onBack = () => {
    setStepError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setStepError(null);
    const parsed = portalOrderFormSchema.safeParse(data);
    if (!parsed.success) {
      setStepError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }
    try {
      const res = await submitPortalOrder(orderId, parsed.data);
      if (res?.ok) {
        toast({ title: "Order submitted", description: "We’ll be in touch soon." });
        router.push(`/portal/orders/${orderId}?submitted=1`);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      setStepError("Submission failed. Please try again.");
    }
  });

  const addPlayer = () =>
    append({
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Math.random()),
      player_name: "",
      player_number: "",
      size: "",
      quantity: 1,
    });

  const onPasteBulk = () => {
    const text = window.prompt(
      "Paste rows: Name, Number, Size (one player per line)"
    );
    if (!text) return;
    const rows = text
      .trim()
      .split(/\n/)
      .map((line) => {
        const [player_name, player_number, size] = line
          .split(",")
          .map((s) => s.trim());
        return {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : String(Math.random()),
          player_name: player_name ?? "",
          player_number: player_number ?? "",
          size: size ?? "",
          quantity: 1,
        };
      })
      .filter((r) => r.player_name);
    if (rows.length) replace([...form.getValues("roster"), ...rows]);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStepError(null);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `accounts/${account.id}/artwork/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage.from("artwork").upload(path, file);
      if (error) {
        setStepError(error.message);
        return;
      }
      await registerArtworkAsset(safeName, path);
      form.setValue("artwork_url", path);
      form.setValue("artwork_deferred", false);
      router.refresh();
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2.5 font-sans text-sm font-medium text-white placeholder:text-[#8A94A6] focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]";
  const labelClass = "mb-1 block font-sans text-sm font-medium text-white";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => (i < step ? setStep(i) : undefined)}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= step ? "bg-[#3B7BF8]" : "bg-[#2A3347]"
            )}
            aria-label={`Step ${i + 1} of 4`}
          />
        ))}
      </div>
      <p className="mb-6 font-sans text-xs font-medium uppercase tracking-wider text-[#8A94A6]">
        Step {step + 1} of 4
      </p>

      {stepError && (
        <p className="mb-4 font-sans text-sm font-medium text-red-400" role="alert">
          {stepError}
        </p>
      )}

      <form className="space-y-6">
        {step === 0 && (
          <div className="space-y-4 rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
            <h2 className="font-sans text-lg font-semibold text-white">Project basics</h2>
            <div>
              <label className={labelClass}>Team name</label>
              <input className={inputClass} {...form.register("team_name")} />
              {form.formState.errors.team_name && (
                <p className="mt-1 text-sm font-medium text-red-400">
                  {form.formState.errors.team_name.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Sport</label>
              <input
                className={inputClass}
                placeholder="e.g. Baseball"
                {...form.register("sport")}
              />
            </div>
            <div>
              <label className={labelClass}>Season</label>
              <select className={inputClass} {...form.register("season")}>
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {form.formState.errors.season && (
                <p className="mt-1 text-sm font-medium text-red-400">
                  {form.formState.errors.season.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Deadline</label>
              <input className={inputClass} type="date" {...form.register("deadline")} />
            </div>
            <div>
              <label className={labelClass}>Garment type</label>
              <select className={inputClass} {...form.register("garment_type")}>
                <option value="">Select…</option>
                {GARMENTS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {form.formState.errors.garment_type && (
                <p className="mt-1 text-sm font-medium text-red-400">
                  {form.formState.errors.garment_type.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Decoration method</label>
              <select className={inputClass} {...form.register("decoration_method")}>
                <option value="">Select…</option>
                {DECORATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {form.formState.errors.decoration_method && (
                <p className="mt-1 text-sm font-medium text-red-400">
                  {form.formState.errors.decoration_method.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Quantity</label>
              <input
                className={inputClass}
                type="number"
                min={1}
                {...form.register("quantity", { valueAsNumber: true })}
              />
              {form.formState.errors.quantity && (
                <p className="mt-1 text-sm font-medium text-red-400">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Color / design notes</label>
              <textarea
                className={cn(inputClass, "min-h-[100px]")}
                {...form.register("color_notes")}
              />
            </div>
            <div>
              <label className={labelClass}>Internal notes</label>
              <textarea className={cn(inputClass, "min-h-[80px]")} {...form.register("notes")} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
            <h2 className="font-sans text-lg font-semibold text-white">Roster</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addPlayer}
                className="rounded-lg border border-[#3B7BF8] px-3 py-2 font-sans text-sm font-semibold text-[#3B7BF8] hover:bg-[#0F1521]"
              >
                Add player
              </button>
              <button
                type="button"
                onClick={onPasteBulk}
                className="rounded-lg border border-[#2A3347] px-3 py-2 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8]"
              >
                Bulk import
              </button>
            </div>
            <label className="flex items-center gap-2 font-sans text-sm font-medium text-[#8A94A6]">
              <input type="checkbox" {...form.register("roster_skip")} />
              I&apos;ll add this later
            </label>
            {!rosterSkip && (
              <div className="space-y-3 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left font-sans text-sm">
                  <thead className="text-xs font-medium uppercase text-[#8A94A6]">
                    <tr>
                      <th className="pb-2 pr-2">Name</th>
                      <th className="pb-2 pr-2">#</th>
                      <th className="pb-2 pr-2">Size</th>
                      <th className="pb-2 pr-2">Qty</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((f, idx) => (
                      <tr key={f.id} className="border-t border-[#2A3347]">
                        <td className="py-2 pr-2">
                          <input
                            className={inputClass}
                            {...form.register(`roster.${idx}.player_name` as const)}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            className={inputClass}
                            {...form.register(`roster.${idx}.player_number` as const)}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            className={inputClass}
                            {...form.register(`roster.${idx}.size` as const)}
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            className={inputClass}
                            type="number"
                            min={1}
                            {...form.register(`roster.${idx}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="font-sans text-xs font-semibold text-red-400"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
            <h2 className="font-sans text-lg font-semibold text-white">Artwork</h2>
            <label className="flex items-center gap-2 font-sans text-sm font-medium text-[#8A94A6]">
              <input type="checkbox" {...form.register("artwork_deferred")} />
              I&apos;ll send artwork separately
            </label>
            {!artworkDeferred && (
              <>
                <div>
                  <label className={labelClass}>Upload file</label>
                  <input
                    type="file"
                    accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg"
                    disabled={uploading}
                    onChange={(e) => void onUpload(e)}
                    className="font-sans text-sm font-medium text-[#8A94A6]"
                  />
                </div>
                {artworkAssets.length > 0 && (
                  <div>
                    <p className={labelClass}>Use existing</p>
                    <div className="flex flex-wrap gap-2">
                      {artworkAssets.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            form.setValue("artwork_url", a.storage_path);
                            form.setValue("artwork_deferred", false);
                          }}
                          className="rounded-lg border border-[#2A3347] px-3 py-2 font-sans text-xs font-semibold text-[#8A94A6] hover:border-[#3B7BF8] hover:text-[#3B7BF8]"
                        >
                          {a.filename ?? a.storage_path.split("/").pop()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {form.watch("artwork_url") && (
                  <p className="font-sans text-xs font-medium text-[#8A94A6]">
                    Selected: {form.watch("artwork_url")}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 rounded-xl border border-[#2A3347] bg-[#1C2333] p-6">
            <h2 className="font-sans text-lg font-semibold text-white">Review</h2>
            <dl className="space-y-2 font-sans text-sm font-medium text-[#8A94A6]">
              <div className="flex justify-between gap-4">
                <dt>Team</dt>
                <dd className="text-right text-white">{form.watch("team_name")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Garment</dt>
                <dd className="text-right text-white">{form.watch("garment_type")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Decoration</dt>
                <dd className="text-right text-white">{form.watch("decoration_method")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Quantity</dt>
                <dd className="text-right text-white">{form.watch("quantity")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Deadline</dt>
                <dd className="text-right text-white">{form.watch("deadline") || "—"}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3 border-t border-[#2A3347] pt-4">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
              >
                Edit basics
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
              >
                Edit roster
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="font-sans text-sm font-semibold text-[#3B7BF8] hover:underline"
              >
                Edit artwork
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-[#2A3347] px-5 py-2.5 font-sans text-sm font-semibold text-[#8A94A6] hover:border-[#3B7BF8]"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={onNext}
              className="rounded-lg bg-[#3B7BF8] px-6 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void onSubmit()}
              className="rounded-lg bg-[#3B7BF8] px-6 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
            >
              Submit order
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
