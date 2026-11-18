import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const assets = fileURLToPath(new URL("../src/assets/", import.meta.url));
for (const width of [480, 800, 1200]) {
  await sharp(path.join(assets, "hero.png")).resize({ width, withoutEnlargement: true }).webp({ quality: 90, effort: 6 }).toFile(path.join(assets, `hero-${width}.webp`));
}
