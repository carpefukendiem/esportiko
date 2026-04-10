import { redirect } from "next/navigation";
import { createDraftOrder } from "@/lib/actions/portal";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: { config?: string };
}) {
  const id = await createDraftOrder(searchParams.config ?? null);
  redirect(`/portal/orders/${id}/edit`);
}
