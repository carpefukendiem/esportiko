import type { AccountRow } from "@/types/portal";

export function needsOnboarding(account: AccountRow): boolean {
  const noSport = !account.sport?.trim();
  const noContactName = !account.contact_name?.trim();
  return noSport || noContactName;
}
