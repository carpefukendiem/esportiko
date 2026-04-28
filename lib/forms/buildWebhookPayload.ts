export type FormType =
  | "team-order"
  | "business-order"
  | "contact"
  | "team-roster-details";

const CONTACT_IDENTITY_KEYS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "contactName",
  "name",
] as const;

function omitKeys(
  obj: Record<string, unknown>,
  keys: readonly string[]
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...obj };
  for (const k of keys) {
    delete out[k];
  }
  return out;
}

function deriveContactFields(data: Record<string, unknown>): {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
} {
  const email = String(data.email ?? "").trim();
  const phone = String(data.phone ?? "").trim();

  let firstName = String(data.firstName ?? "").trim();
  let lastName = String(data.lastName ?? "").trim();

  if (!firstName && !lastName) {
    const single = String(data.contactName ?? data.name ?? "").trim();
    if (single) {
      const parts = single.split(/\s+/).filter(Boolean);
      if (parts.length === 1) {
        firstName = parts[0] ?? "";
        lastName = "";
      } else {
        firstName = parts[0] ?? "";
        lastName = parts.slice(1).join(" ");
      }
    }
  }

  const name =
    `${firstName} ${lastName}`.trim() ||
    String(data.contactName ?? data.name ?? "").trim();

  return { firstName, lastName, name, email, phone };
}

/**
 * Flatten nested objects/arrays to top-level keys so GHL workflow
 * builder can reference them. Arrays become comma-separated strings,
 * objects get prefixed keys (e.g., address: { city } → address_city).
 */
function flattenForGhl(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;

    if (value === null || value === undefined) {
      result[fullKey] = "";
    } else if (Array.isArray(value)) {
      result[fullKey] = value
        .map((v) => (typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)))
        .join(", ");
    } else if (typeof value === "object") {
      Object.assign(result, flattenForGhl(value as Record<string, unknown>, fullKey));
    } else if (typeof value === "boolean") {
      result[fullKey] = value ? "true" : "false";
    } else {
      result[fullKey] = String(value);
    }
  }

  return result;
}

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, " ")
    .trim();
}

function formatValueForSummary(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)))
      .join(", ");
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Build a multi-line readable summary of the submission. This is what
 * the GHL email template should reference as a single field, ensuring
 * the email body is never blank even if individual merge tags fail.
 */
function formatFormSummary(formType: FormType, data: Record<string, unknown>): string {
  const lines: string[] = [];

  const labels: Record<FormType, string> = {
    "team-order": "Team / Uniform Order Request",
    "business-order": "Business / Brand Apparel Request",
    contact: "Contact Form Submission",
    "team-roster-details": "Team Roster Details",
  };

  lines.push(`=== ${labels[formType]} ===`);
  lines.push("");

  const c = deriveContactFields(data);
  if (c.name) lines.push(`Name: ${c.name}`);
  if (c.email) lines.push(`Email: ${c.email}`);
  if (c.phone) lines.push(`Phone: ${c.phone}`);

  lines.push("");
  lines.push("--- Details ---");

  const skip = new Set([
    "firstName",
    "lastName",
    "email",
    "phone",
    "name",
    "contactName",
    "formType",
  ]);

  for (const [key, value] of Object.entries(data)) {
    if (skip.has(key)) continue;
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;

    const label = humanize(key);
    const text = formatValueForSummary(value);
    if (!text) continue;
    lines.push(`${label}: ${text}`);
  }

  lines.push("");
  lines.push(`Submitted: ${new Date().toLocaleString()}`);

  return lines.join("\n");
}

export function buildWebhookPayload(
  formType: FormType,
  data: Record<string, unknown>,
  meta?: { pageUrl?: string }
): Record<string, unknown> {
  const withoutFormType: Record<string, unknown> = { ...data };
  delete withoutFormType.formType;

  const contact = deriveContactFields(withoutFormType);
  const rest = omitKeys(withoutFormType, CONTACT_IDENTITY_KEYS);

  const summary = formatFormSummary(formType, data);

  return {
    ...flattenForGhl(rest),
    firstName: contact.firstName,
    lastName: contact.lastName,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    formType,
    source: "Esportiko Website",
    submittedAt: new Date().toISOString(),
    pageUrl: meta?.pageUrl ?? "",
    formSummary: summary,
  };
}
