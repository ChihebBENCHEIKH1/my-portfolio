import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0e1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d1530;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Grid lines subtle -->
  <line x1="0" y1="210" x2="1200" y2="210" stroke="#ffffff08" stroke-width="1"/>
  <line x1="0" y1="420" x2="1200" y2="420" stroke="#ffffff08" stroke-width="1"/>
  <line x1="400" y1="0" x2="400" y2="630" stroke="#ffffff08" stroke-width="1"/>
  <line x1="800" y1="0" x2="800" y2="630" stroke="#ffffff08" stroke-width="1"/>

  <!-- Glowing orb top-right -->
  <circle cx="1050" cy="120" r="180" fill="#6366f1" opacity="0.08" filter="url(#glow)"/>
  <circle cx="150" cy="520" r="140" fill="#06b6d4" opacity="0.07" filter="url(#glow)"/>

  <!-- Accent bar top -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)" />

  <!-- Left bracket decoration -->
  <text x="80" y="380" font-family="monospace" font-size="200" fill="#06b6d4" opacity="0.06">{</text>

  <!-- Tag decoration top-left -->
  <text x="80" y="130" font-family="monospace" font-size="14" fill="#06b6d4" opacity="0.6">&lt;portfolio /&gt;</text>

  <!-- Main name -->
  <text
    x="80"
    y="300"
    font-family="Georgia, serif"
    font-size="72"
    font-weight="bold"
    fill="#f1f5f9"
    letter-spacing="-1"
  >Chiheb Ben Cheikh</text>

  <!-- Accent line under name -->
  <rect x="80" y="318" width="520" height="3" fill="url(#accent)" rx="2"/>

  <!-- Job title -->
  <text
    x="80"
    y="375"
    font-family="monospace"
    font-size="28"
    fill="#06b6d4"
    letter-spacing="2"
  >Full-Stack Frontend Developer</text>

  <!-- Tech stack tags -->
  <!-- React tag -->
  <rect x="80" y="420" width="90" height="34" rx="6" fill="#06b6d420"/>
  <rect x="80" y="420" width="90" height="34" rx="6" fill="none" stroke="#06b6d440" stroke-width="1"/>
  <text x="125" y="442" font-family="monospace" font-size="14" fill="#06b6d4" text-anchor="middle">React</text>

  <!-- TypeScript tag -->
  <rect x="184" y="420" width="110" height="34" rx="6" fill="#6366f120"/>
  <rect x="184" y="420" width="110" height="34" rx="6" fill="none" stroke="#6366f140" stroke-width="1"/>
  <text x="239" y="442" font-family="monospace" font-size="14" fill="#818cf8" text-anchor="middle">TypeScript</text>

  <!-- Node.js tag -->
  <rect x="308" y="420" width="90" height="34" rx="6" fill="#06b6d420"/>
  <rect x="308" y="420" width="90" height="34" rx="6" fill="none" stroke="#06b6d440" stroke-width="1"/>
  <text x="353" y="442" font-family="monospace" font-size="14" fill="#06b6d4" text-anchor="middle">Node.js</text>

  <!-- Website URL bottom -->
  <text
    x="80"
    y="560"
    font-family="monospace"
    font-size="18"
    fill="#64748b"
  >chihebbencheikh.com</text>

  <!-- Decorative dots top-right corner -->
  <circle cx="960" cy="280" r="3" fill="#06b6d4" opacity="0.5"/>
  <circle cx="980" cy="280" r="3" fill="#6366f1" opacity="0.5"/>
  <circle cx="1000" cy="280" r="3" fill="#06b6d4" opacity="0.5"/>
  <circle cx="960" cy="300" r="3" fill="#6366f1" opacity="0.3"/>
  <circle cx="980" cy="300" r="3" fill="#06b6d4" opacity="0.3"/>
  <circle cx="1000" cy="300" r="3" fill="#6366f1" opacity="0.3"/>
  <circle cx="960" cy="320" r="3" fill="#06b6d4" opacity="0.15"/>
  <circle cx="980" cy="320" r="3" fill="#6366f1" opacity="0.15"/>
  <circle cx="1000" cy="320" r="3" fill="#06b6d4" opacity="0.15"/>

  <!-- Accent bar bottom -->
  <rect x="0" y="626" width="1200" height="4" fill="url(#accent)" />
</svg>
`;

const outputPath = resolve(__dirname, "../public/og-image.png");

await sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath);

console.log("✅ OG image generated at public/og-image.png (1200x630)");
