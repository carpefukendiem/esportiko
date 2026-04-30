import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

/** Logo asset (repo uses `images/logo/` for the modern mark). */
const SOURCE = path.resolve("public/images/logo/esportiko-modern-logo.webp");
const OUTPUT_DIR = path.resolve("public/favicons");

const SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

const navyBg = { r: 10, g: 22, b: 40, alpha: 1 };

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const { name, size } of SIZES) {
    await sharp(SOURCE)
      .resize(size, size, {
        fit: "contain",
        background: navyBg,
      })
      .png()
      .toFile(path.join(OUTPUT_DIR, name));
    console.log(`✓ ${name}`);
  }

  await sharp(SOURCE)
    .resize(32, 32, { fit: "contain", background: navyBg })
    .png()
    .toFile(path.resolve("public/favicon.ico"));
  console.log("✓ favicon.ico");
}

main().catch(console.error);
