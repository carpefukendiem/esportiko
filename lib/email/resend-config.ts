/** Normalize env values pasted from dashboards (whitespace, wrapping quotes). */
function stripOuterQuotes(s: string): string {
  const t = s.trim().replace(/^\uFEFF/, "");
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

export type ResendEnv =
  | { ok: true; apiKey: string; from: string }
  | { ok: false; reason: string };

/**
 * Reads Resend credentials at request time (avoids relying on a single env shape).
 * Supports `RESEND_FROM` as an alias for `RESEND_FROM_EMAIL`.
 */
export function loadResendEnv(): ResendEnv {
  const rawKey = process.env["RESEND_API_KEY"];
  const rawFrom = process.env["RESEND_FROM_EMAIL"] ?? process.env["RESEND_FROM"];
  const apiKey = typeof rawKey === "string" ? stripOuterQuotes(rawKey) : "";
  const from = typeof rawFrom === "string" ? stripOuterQuotes(rawFrom) : "";
  if (!apiKey || !from) {
    return {
      ok: false,
      reason:
        "Server is missing RESEND_API_KEY or a sender (set RESEND_FROM_EMAIL or RESEND_FROM to a verified address, then redeploy).",
    };
  }
  return { ok: true, apiKey, from };
}

export async function postResendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject: params.subject,
        text: params.text,
      }),
    });
    const raw = await res.text();
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const j = JSON.parse(raw) as { message?: string };
        if (j?.message) message = j.message;
      } catch {
        if (raw) message = raw.slice(0, 400);
      }
      console.error("Resend error", res.status, raw);
      return { ok: false, message };
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Resend fetch failed", e);
    return { ok: false, message };
  }
}
