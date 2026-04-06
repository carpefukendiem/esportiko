"use client";

import {
  useFieldArray,
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TeamOrderFormValues } from "@/lib/schemas/teamOrderSchema";

export function RosterTable({
  control,
  register,
  errors,
}: {
  control: Control<TeamOrderFormValues>;
  register: UseFormRegister<TeamOrderFormValues>;
  errors: FieldErrors<TeamOrderFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "roster",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">
            Roster details
          </h3>
          <p className="text-body-sm text-gray-soft">
            Add each player row. Quantities can reflect multiple garments per player.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              playerName: "",
              number: "",
              size: "",
              quantity: 1,
              notes: "",
            })
          }
        >
          + Add player
        </Button>
      </div>

      {errors.roster && typeof errors.roster.message === "string" ? (
        <p className="text-body-sm text-error" role="alert">
          {errors.roster.message}
        </p>
      ) : null}

      <AnimatePresence initial={false}>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-slate bg-navy-mid p-4"
          >
            <div className="mb-4 flex items-center justify-between md:hidden">
              <span className="font-sans text-label font-medium uppercase tracking-wider text-gray-soft">
                Player {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                className="text-error hover:text-error"
                aria-label={`Remove player ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="hidden grid-cols-12 gap-3 md:grid">
              <div className="col-span-3">
                <Label htmlFor={`roster-${index}-name`}>Player name</Label>
                <Input
                  id={`roster-${index}-name`}
                  className="mt-1"
                  {...register(`roster.${index}.playerName` as const)}
                  error={!!errors.roster?.[index]?.playerName}
                />
                {errors.roster?.[index]?.playerName ? (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.roster[index]?.playerName?.message as string}
                  </p>
                ) : null}
              </div>
              <div className="col-span-2">
                <Label htmlFor={`roster-${index}-num`}>Number</Label>
                <Input
                  id={`roster-${index}-num`}
                  className="mt-1"
                  {...register(`roster.${index}.number` as const)}
                  error={!!errors.roster?.[index]?.number}
                />
                {errors.roster?.[index]?.number ? (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.roster[index]?.number?.message as string}
                  </p>
                ) : null}
              </div>
              <div className="col-span-2">
                <Label htmlFor={`roster-${index}-size`}>Size</Label>
                <Input
                  id={`roster-${index}-size`}
                  className="mt-1"
                  {...register(`roster.${index}.size` as const)}
                  error={!!errors.roster?.[index]?.size}
                />
                {errors.roster?.[index]?.size ? (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.roster[index]?.size?.message as string}
                  </p>
                ) : null}
              </div>
              <div className="col-span-2">
                <Label htmlFor={`roster-${index}-qty`}>Qty</Label>
                <Input
                  id={`roster-${index}-qty`}
                  type="number"
                  min={1}
                  className="mt-1"
                  {...register(`roster.${index}.quantity` as const, {
                    valueAsNumber: true,
                  })}
                  error={!!errors.roster?.[index]?.quantity}
                />
                {errors.roster?.[index]?.quantity ? (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.roster[index]?.quantity?.message as string}
                  </p>
                ) : null}
              </div>
              <div className="col-span-2">
                <Label htmlFor={`roster-${index}-notes`}>Notes</Label>
                <Input
                  id={`roster-${index}-notes`}
                  className="mt-1"
                  {...register(`roster.${index}.notes` as const)}
                />
              </div>
              <div className="col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-error hover:text-error"
                  aria-label={`Remove player row ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              <div>
                <Label htmlFor={`m-roster-${index}-name`}>Player name</Label>
                <Input
                  id={`m-roster-${index}-name`}
                  className="mt-1"
                  {...register(`roster.${index}.playerName` as const)}
                  error={!!errors.roster?.[index]?.playerName}
                />
                {errors.roster?.[index]?.playerName ? (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.roster[index]?.playerName?.message as string}
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`m-roster-${index}-num`}>Number</Label>
                  <Input
                    id={`m-roster-${index}-num`}
                    className="mt-1"
                    {...register(`roster.${index}.number` as const)}
                    error={!!errors.roster?.[index]?.number}
                  />
                </div>
                <div>
                  <Label htmlFor={`m-roster-${index}-size`}>Size</Label>
                  <Input
                    id={`m-roster-${index}-size`}
                    className="mt-1"
                    {...register(`roster.${index}.size` as const)}
                    error={!!errors.roster?.[index]?.size}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`m-roster-${index}-qty`}>Quantity</Label>
                <Input
                  id={`m-roster-${index}-qty`}
                  type="number"
                  min={1}
                  className="mt-1"
                  {...register(`roster.${index}.quantity` as const, {
                    valueAsNumber: true,
                  })}
                  error={!!errors.roster?.[index]?.quantity}
                />
              </div>
              <div>
                <Label htmlFor={`m-roster-${index}-notes`}>Notes</Label>
                <Input
                  id={`m-roster-${index}-notes`}
                  className="mt-1"
                  {...register(`roster.${index}.notes` as const)}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
