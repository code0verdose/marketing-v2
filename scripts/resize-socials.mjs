// One-off image optimiser: pre-downscales the 3000x3000 social icons to
// three sized variants (256 / 512 / 768) using Lanczos3 filtering.
// Lanczos3 is a multi-lobe windowed sinc — gives pristine edges compared
// to the single-step bicubic browsers use for extreme downscales.
//
// Run: node scripts/resize-socials.mjs
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, parse } from "node:path";

const SRC = "public/3d-socials";
const OUT = "public/3d-socials"; // write alongside originals
const SIZES = [256, 512, 768];
const TARGETS = ["Instagram", "Tiktok", "Youtube"];

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter(
  (f) => TARGETS.includes(parse(f).name) && f.toLowerCase().endsWith(".png")
);

for (const f of files) {
  const { name } = parse(f);
  const input = join(SRC, f);

  for (const size of SIZES) {
    const out = join(OUT, `${name}-${size}.png`);
    await sharp(input)
      .resize(size, size, {
        kernel: sharp.kernel.lanczos3,
        fit: "inside",
      })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false,
      })
      .toFile(out);
    console.log(`✔ ${out}`);
  }
}
console.log("Done.");
