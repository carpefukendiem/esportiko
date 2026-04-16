"use client";

import type { ReactElement } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { GarmentTypeValue } from "@/lib/portal/garmentTypes";

const OPTIONS: {
  value: GarmentTypeValue;
  description: string;
  Icon: () => ReactElement;
}[] = [
  {
    value: "Jerseys",
    description: "Game day uniforms",
    Icon: IconJersey,
  },
  {
    value: "Hoodies",
    description: "Team & spirit wear",
    Icon: IconHoodie,
  },
  {
    value: "T-Shirts",
    description: "Events & casual",
    Icon: IconTee,
  },
  {
    value: "Polos",
    description: "Staff & business",
    Icon: IconPolo,
  },
  {
    value: "Hats",
    description: "Structured & dad caps",
    Icon: IconHat,
  },
  {
    value: "Warm-ups",
    description: "Full sets & jackets",
    Icon: IconWarmup,
  },
  {
    value: "Spirit Wear",
    description: "Fan & sideline gear",
    Icon: IconSpirit,
  },
  {
    value: "Other",
    description: "Something else",
    Icon: IconOther,
  },
];

const cardBase =
  "flex flex-col gap-2 rounded-xl border p-4 text-left transition-colors cursor-pointer";
const cardIdle =
  "border-[#2A3347] bg-[#1C2333] hover:border-[#3B7BF8]";
const cardSelected = "border-[#3B7BF8] bg-[#3B7BF8]/10";

export function GarmentSelector<TFieldValues extends FieldValues>({
  control,
  name = "garment_type" as FieldPath<TFieldValues>,
}: {
  control: Control<TFieldValues>;
  name?: FieldPath<TFieldValues>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: "Select a garment type" }}
      render={({ field, fieldState }) => (
        <div>
          <ul
            className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4"
            role="listbox"
            aria-label="Garment type"
          >
            {OPTIONS.map(({ value, description, Icon }) => {
              const selected = field.value === value;
              return (
                <li key={value} className="min-w-0 list-none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => field.onChange(value)}
                    className={cn(
                      cardBase,
                      "w-full",
                      selected ? cardSelected : cardIdle
                    )}
                  >
                    <span className="text-[#8A94A6]" aria-hidden>
                      <Icon />
                    </span>
                    <span className="font-sans font-medium text-white">
                      {value}
                    </span>
                    <span className="font-sans text-xs leading-snug text-[#8A94A6]">
                      {description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {fieldState.error ? (
            <p className="mt-2 font-sans text-sm font-medium text-red-400" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}

function IconJersey() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M10 8h16l3 4v18H7V12l3-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M14 14h8M14 18h8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHoodie() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M8 14 12 10h12l4 4v16H8V14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 10c2-3 4-4 6-4s4 1 6 4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M10 26h16" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconTee() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M10 12 14 8h8l4 4 4 4v14H6V16l4-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M12 20h12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconPolo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M10 14 14 10h8l4 4v16H6V14h4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M16 10v6l2 2 2-2v-6"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

function IconHat() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <ellipse
        cx="18"
        cy="22"
        rx="12"
        ry="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M10 22c0-6 3.5-10 8-10s8 4 8 10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function IconWarmup() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M9 12h18v16H9V12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M9 12 12 8h12l3 4M12 20h12M12 24h8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSpirit() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M8 26 18 10l10 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 22h8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconOther() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M18 12v4M18 22v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
