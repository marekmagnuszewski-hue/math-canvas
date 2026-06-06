const sharp = require('sharp');
const path  = require('path');

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1B4332" rx="${Math.round(size * 0.18)}"/>
  <text x="256" y="355"
        font-family="Georgia, serif"
        font-size="300"
        font-weight="bold"
        fill="#F3F0E8"
        text-anchor="middle">M</text>
</svg>`;

const sizes = [180, 192, 512];

(async () => {
  for (const size of sizes) {
    const out = path.join(__dirname, '..', 'public', 'icons', `icon-${size}.png`);
    await sharp(Buffer.from(svg(size)))
      .resize(size, size)
      .png()
      .toFile(out);
    console.log(`Created ${out}`);
  }
})();
