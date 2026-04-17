import { redirect } from "next/navigation";
import { createDraftOrder } from "@/lib/actions/portal";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ config?: string }>;
}) {
  const sp = await searchParams;
  const id = await createDraftOrder(sp.config ?? null);
  redirect(`/portal/orders/${id}/edit`);
}
