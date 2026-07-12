/**
 * PWA Icon Generator
 * Run: node scripts/generate-icons.js
 * Requires: npm install canvas (one-time)
 *
 * Generates PNG icons from the portfolio's "N" branding for the PWA manifest.
 */
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '..', 'src', 'assets', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  const bgColor = '#0a0a0f';
  const radius = size * 0.2;

  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fillStyle = bgColor;
  ctx.fill();

  if (maskable) {
    // Maskable icons need full bleed background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
  }

  // Gradient text "N"
  const fontSize = size * 0.5;
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#00d4ff');
  gradient.addColorStop(1, '#a855f7');
  ctx.fillStyle = gradient;
  ctx.fillText('N', size / 2, size / 2 + fontSize * 0.05);

  const suffix = maskable ? '-maskable' : '';
  const filename = `icon-${size}x${size}${suffix}.png`;
  const filepath = path.join(outputDir, filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filename}`);
}

sizes.forEach(size => generateIcon(size, false));
generateIcon(512, true);

console.log('\\nAll PWA icons generated successfully!');
