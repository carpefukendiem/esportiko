import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { downloadSanMarFile, SANMAR_EPDD_PATH } from "@/lib/catalog/sanmar-ftp";
import { parseEpddCsv } from "@/lib/catalog/sanmar-parser";
import { recordSyncRun, upsertStyles } from "@/lib/catalog/sanmar-upsert";
import { CUSTOMIZE_STYLE_NUMBERS } from "@/lib/customize/skus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const qp = req.nextUrl.searchParams.get("secret");
  if (!secret || (auth !== `Bearer ${secret}` && qp !== secret)) {
    return unauthorized();
  }

  const startedAt = new Date().toISOString();
  const t0 = Date.now();
  try {
    const csv = await downloadSanMarFile(SANMAR_EPDD_PATH);
    const { styles, rowCount } = parseEpddCsv(csv);
    const styleNums = new Set(styles.map((s) => s.styleNumber));
    for (const sn of CUSTOMIZE_STYLE_NUMBERS) {
      if (!styleNums.has(sn.toUpperCase())) {
        console.warn(`[sanmar sync] Customize SKU not in catalog: ${sn}`);
      }
    }
    const n = await upsertStyles(styles);
    const finishedAt = new Date().toISOString();
    await recordSyncRun({
      status: "success",
      startedAt,
      finishedAt,
      rowsParsed: rowCount,
      stylesUpserted: n,
    });
    revalidatePath("/customize");
    return NextResponse.json({
      ok: true,
      parsedRows: rowCount,
      curatedStylesUpserted: n,
      ms: Date.now() - t0,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    await recordSyncRun({
      status: "error",
      startedAt,
      finishedAt: new Date().toISOString(),
      rowsParsed: null,
      stylesUpserted: null,
      errorMessage: msg,
    }).catch(() => {});
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
