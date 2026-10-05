import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Simple CRC32 implementation
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createCyberpunkPng(width, height) {
  // Signature
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Generate image data (scanlines with filter byte 0)
  const scanlines = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter 0 (None)
    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      // Cyberpunk gradient: #05070f background with #00f0ff (cyan) and #ff007f (magenta) borders & glow
      const cx = x / width;
      const cy = y / height;
      const distFromCenter = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2);
      
      // Rounded corner box
      const rx = Math.abs(x - width / 2) / (width / 2);
      const ry = Math.abs(y - height / 2) / (height / 2);
      const isCorner = (rx > 0.85 && ry > 0.85 && Math.hypot(rx - 0.85, ry - 0.85) > 0.15);

      if (isCorner) {
        row[idx] = 0;
        row[idx + 1] = 0;
        row[idx + 2] = 0;
        row[idx + 3] = 0; // Transparent
        continue;
      }

      // Border effect
      const isBorder = (x <= 1 || x >= width - 2 || y <= 1 || y >= height - 2);
      if (isBorder) {
        row[idx] = 0x00;     // R
        row[idx + 1] = 0xF0; // G
        row[idx + 2] = 0xFF; // B (Cyan)
        row[idx + 3] = 0xFF;
        continue;
      }

      // Center symbol / sound waves effect
      const inWave = Math.abs(y - height / 2) < (height * 0.25) * Math.sin(x / width * Math.PI * 3);
      if (distFromCenter < 0.25 || inWave) {
        row[idx] = Math.floor(255 * (1 - cx));      // Magenta to Cyan
        row[idx + 1] = Math.floor(240 * cx);
        row[idx + 2] = 255;
        row[idx + 3] = 255;
      } else {
        // Dark Obsidian Cyber Background
        row[idx] = 0x07;
        row[idx + 1] = 0x0B;
        row[idx + 2] = 0x14;
        row[idx + 3] = 0xFF;
      }
    }
    scanlines.push(row);
  }

  const rawData = Buffer.concat(scanlines);
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(process.cwd(), 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Create PNG icons
const png128 = createCyberpunkPng(128, 128);
const png48 = createCyberpunkPng(48, 48);
const png16 = createCyberpunkPng(16, 16);

fs.writeFileSync(path.join(iconsDir, 'icon128.png'), png128);
fs.writeFileSync(path.join(iconsDir, 'icon48.png'), png48);
fs.writeFileSync(path.join(iconsDir, 'icon16.png'), png16);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png48);

// Create Cyberpunk SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="50%" stop-color="#7000ff" />
      <stop offset="100%" stop-color="#ff007f" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Outer Dark Cyber Plate -->
  <rect x="4" y="4" width="120" height="120" rx="28" fill="#05070f" stroke="#00f0ff" stroke-width="2" />
  
  <!-- Corner Tech Accents -->
  <path d="M 12 28 L 12 12 L 28 12" fill="none" stroke="#ff007f" stroke-width="2" />
  <path d="M 116 28 L 116 12 L 100 12" fill="none" stroke="#00f0ff" stroke-width="2" />
  <path d="M 12 100 L 12 116 L 28 116" fill="none" stroke="#00f0ff" stroke-width="2" />
  <path d="M 116 100 L 116 116 L 100 116" fill="none" stroke="#ff007f" stroke-width="2" />

  <!-- Audio Waveform Grid Lines -->
  <line x1="28" y1="64" x2="28" y2="64" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
  <line x1="38" y1="52" x2="38" y2="76" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
  <line x1="48" y1="40" x2="48" y2="88" stroke="url(#neonGrad)" stroke-width="4" stroke-linecap="round" />
  
  <!-- Phonetic IPA /ə/ (Schwa) Symbol Centerpiece -->
  <text x="74" y="76" font-family="'JetBrains Mono', 'Fira Code', 'Courier New', monospace" font-size="44" font-weight="900" fill="url(#neonGrad)" filter="url(#glow)" text-anchor="middle">/ə/</text>

  <line x1="100" y1="46" x2="100" y2="82" stroke="#ff007f" stroke-width="4" stroke-linecap="round" />
  
  <!-- Status LED -->
  <circle cx="106" cy="22" r="3" fill="#00ff66" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon);
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

console.log('Icons generated successfully in /public and /public/icons');
