import { redirect } from "next/navigation";
import { createDraftOrder } from "@/lib/actions/portal";

export const dynamic = "force-dynamic";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: { config?: string };
}) {
  let id: string;
  try {
    id = await createDraftOrder(searchParams.config ?? null);
  } catch (e) {
    console.error("[new-order]", e);
    redirect("/portal/dashboard?order_error=1");
  }
  redirect(`/portal/orders/${id}/edit`);
}
