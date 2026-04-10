"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { updateDefaultRoster } from "@/lib/actions/portal";
import type { AccountRow, DefaultRosterJson } from "@/types/portal";

type Row = { name: string; number: string; preferred_size: string };

type FormValues = {
  use_default_roster_for_new_orders: boolean;
  players: Row[];
};

export function RosterManager({
  account,
  initialRoster,
}: {
  account: AccountRow;
  initialRoster: DefaultRosterJson;
}) {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      use_default_roster_for_new_orders:
        account.use_default_roster_for_new_orders,
      players:
        initialRoster.length > 0
          ? initialRoster.map((p) => ({
              name: p.name,
              number: p.number,
              preferred_size: p.preferred_size,
            }))
          : [{ name: "", number: "", preferred_size: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "players",
  });

  const inputClass =
    "w-full rounded-lg border border-[#2A3347] bg-[#1C2333] px-3 py-2 font-sans text-sm font-medium text-white focus:border-[#3B7BF8] focus:outline-none focus:ring-1 focus:ring-[#3B7BF8]";

  return (
    <form
      className="space-y-6 rounded-xl border border-[#2A3347] bg-[#1C2333] p-6"
      onSubmit={form.handleSubmit(async (data) => {
        const roster: DefaultRosterJson = data.players
          .filter((p) => p.name.trim())
          .map((p) => ({
            name: p.name.trim(),
            number: p.number.trim(),
            preferred_size: p.preferred_size.trim(),
          }));
        await updateDefaultRoster({
          default_roster: roster,
          use_default_roster_for_new_orders:
            data.use_default_roster_for_new_orders,
        });
        router.refresh();
      })}
    >
      <label className="flex items-center gap-2 font-sans text-sm font-medium text-[#8A94A6]">
        <input
          type="checkbox"
          {...form.register("use_default_roster_for_new_orders")}
        />
        Use as starting roster for new orders
      </label>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-sans text-sm font-semibold text-white">
            Players
          </span>
          <button
            type="button"
            onClick={() =>
              append({ name: "", number: "", preferred_size: "" })
            }
            className="rounded-lg border border-[#3B7BF8] px-3 py-1.5 font-sans text-xs font-semibold text-[#3B7BF8]"
          >
            Add player
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-left font-sans text-sm">
            <thead className="text-xs font-medium uppercase text-[#8A94A6]">
              <tr>
                <th className="pb-2 pr-2">Name</th>
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">Size</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {fields.map((f, idx) => (
                <tr key={f.id} className="border-t border-[#2A3347]">
                  <td className="py-2 pr-2">
                    <input className={inputClass} {...form.register(`players.${idx}.name`)} />
                  </td>
                  <td className="py-2 pr-2">
                    <input className={inputClass} {...form.register(`players.${idx}.number`)} />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      className={inputClass}
                      {...form.register(`players.${idx}.preferred_size`)}
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
      </div>

      <button
        type="submit"
        className="rounded-lg bg-[#3B7BF8] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
      >
        Save roster
      </button>
    </form>
  );
}
