import { WORK_ITEMS } from "@/lib/content/our-work";
import fs from "fs/promises";
import path from "path";

async function main() {
  const errors: string[] = [];

  for (const item of WORK_ITEMS) {
    const fullPath = path.resolve("public", item.imagePath.replace(/^\//, ""));
    try {
      await fs.access(fullPath);
    } catch {
      errors.push(`Missing image: ${item.imagePath} (referenced by ${item.id})`);
    }
  }

  if (errors.length > 0) {
    console.error("Broken Our Work references:");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`✓ All ${WORK_ITEMS.length} Our Work items have valid images`);
}

main().catch(console.error);
