const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createEliteOgImage() {
  const WIDTH = 1200;
  const HEIGHT = 630;

  // 1. Prepare photo on the right: 530 x 530 with rounded corners
  const PHOTO_W = 530;
  const PHOTO_H = 530;
  const CORNER_RADIUS = 30;

  const maskSvg = `
    <svg width="${PHOTO_W}" height="${PHOTO_H}">
      <rect x="0" y="0" width="${PHOTO_W}" height="${PHOTO_H}" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="#fff"/>
    </svg>
  `;
  const roundedMask = Buffer.from(maskSvg);

  const croppedPhoto = await sharp(path.join(__dirname, '../public/images/opening-photo.webp'))
    .resize(PHOTO_W, PHOTO_H, { fit: 'cover', position: 'center' })
    .composite([{ input: roundedMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Prepare trimmed logo
  const trimmedLogo = await sharp(path.join(__dirname, '../public/icon.png'))
    .trim()
    .resize(280, null, { fit: 'inside' })
    .png()
    .toBuffer();

  // Layer 1: Background canvas with glows, dot pattern and photo card frame
  const bgSvg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCFCFE"/>
        <stop offset="45%" stop-color="#F4F1FD"/>
        <stop offset="100%" stop-color="#E9E3F8"/>
      </linearGradient>

      <radialGradient id="purpleOrb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#887ed8" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#887ed8" stop-opacity="0"/>
      </radialGradient>

      <radialGradient id="amberOrb" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
      </radialGradient>

      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#2a1d4e" flood-opacity="0.14"/>
      </filter>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
    <circle cx="1060" cy="140" r="320" fill="url(#purpleOrb)"/>
    <circle cx="140" cy="530" r="280" fill="url(#amberOrb)"/>
    <circle cx="600" cy="70" r="200" fill="url(#purpleOrb)" opacity="0.4"/>

    <!-- Subtle Dot Pattern -->
    <g opacity="0.15">
      <circle cx="64" cy="50" r="2" fill="#887ed8"/><circle cx="94" cy="50" r="2" fill="#887ed8"/><circle cx="124" cy="50" r="2" fill="#887ed8"/><circle cx="154" cy="50" r="2" fill="#887ed8"/>
      <circle cx="64" cy="80" r="2" fill="#887ed8"/><circle cx="94" cy="80" r="2" fill="#887ed8"/><circle cx="124" cy="80" r="2" fill="#887ed8"/><circle cx="154" cy="80" r="2" fill="#887ed8"/>
      <circle cx="64" cy="110" r="2" fill="#887ed8"/><circle cx="94" cy="110" r="2" fill="#887ed8"/><circle cx="124" cy="110" r="2" fill="#887ed8"/><circle cx="154" cy="110" r="2" fill="#887ed8"/>
    </g>

    <!-- White Frame behind Photo with Deep Drop Shadow -->
    <rect x="610" y="50" width="${PHOTO_W}" height="${PHOTO_H}" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="#ffffff" filter="url(#softShadow)"/>
  </svg>
  `;

  // Layer 2: Foreground UI Elements (Badges, Vector Icons, Typography, Contact Banner, Floating Overlay)
  const fgSvg = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#887ed8"/>
        <stop offset="100%" stop-color="#6c5fc7"/>
      </linearGradient>

      <filter id="pillShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#4a3f75" flood-opacity="0.06"/>
      </filter>

      <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#1f143d" flood-opacity="0.18"/>
      </filter>
    </defs>

    <!-- Photo border outline -->
    <rect x="610" y="50" width="${PHOTO_W}" height="${PHOTO_H}" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="none" stroke="#ffffff" stroke-width="6"/>

    <!-- ==================== LEFT COLUMN ==================== -->

    <!-- Location Pill -->
    <g transform="translate(60, 44)">
      <rect width="280" height="34" rx="17" fill="#ffffff" stroke="#887ed8" stroke-width="1.2" stroke-opacity="0.35" filter="url(#pillShadow)"/>
      <!-- Pin Vector Icon -->
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#887ed8" transform="translate(10, 5) scale(0.9)"/>
      <text x="36" y="22" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="12.5" font-weight="700" fill="#685bbd" letter-spacing="0.6">
        БУРГАС • Ж.К. СЛАВЕЙКОВ
      </text>
    </g>

    <!-- Subtitle above Logo -->
    <text x="62" y="116" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="14" font-weight="800" fill="#7d739e" letter-spacing="2.8">
      ОБРАЗОВАТЕЛЕН КЛУБ
    </text>

    <!-- (Logo is composited at x=60, y=126) -->

    <!-- Main Tagline under Logo -->
    <text x="62" y="260" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="20" font-weight="700" fill="#292044">
      Уроци, занималня и развитие за успешни деца
    </text>

    <!-- SERVICES GRID -->

    <!-- Card 1: Учебна занималня -->
    <g transform="translate(60, 288)">
      <rect width="250" height="44" rx="13" fill="#ffffff" stroke="#e3def5" stroke-width="1.2" filter="url(#pillShadow)"/>
      <rect x="7" y="7" width="30" height="30" rx="8" fill="#f1eeff"/>
      <!-- Open Book Vector Icon -->
      <g transform="translate(12, 12) scale(0.85)">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke="#887ed8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="48" y="28" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="14.5" font-weight="700" fill="#312658">Учебна занималня</text>
      <text x="194" y="27" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="11.5" font-weight="600" fill="#887ed8">1.-4. кл</text>
    </g>

    <!-- Card 2: БЕЛ и Математика -->
    <g transform="translate(322, 288)">
      <rect width="248" height="44" rx="13" fill="#ffffff" stroke="#e3def5" stroke-width="1.2" filter="url(#pillShadow)"/>
      <rect x="7" y="7" width="30" height="30" rx="8" fill="#fef3c7"/>
      <!-- Pencil / Math Vector Icon -->
      <g transform="translate(12, 12) scale(0.85)">
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z M15 5l4 4" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="48" y="28" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="14.5" font-weight="700" fill="#312658">БЕЛ и Математика</text>
    </g>

    <!-- Card 3: Английски език -->
    <g transform="translate(60, 342)">
      <rect width="250" height="44" rx="13" fill="#ffffff" stroke="#e3def5" stroke-width="1.2" filter="url(#pillShadow)"/>
      <rect x="7" y="7" width="30" height="30" rx="8" fill="#e0f2fe"/>
      <!-- Globe Vector Icon -->
      <g transform="translate(12, 12) scale(0.85)">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#0284c7" stroke-width="2.2"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="#0284c7" stroke-width="2"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="#0284c7" stroke-width="2"/>
      </g>
      <text x="48" y="28" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="14.5" font-weight="700" fill="#312658">Английски език</text>
      <text x="180" y="27" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="11.5" font-weight="600" fill="#0284c7">курсове</text>
    </g>

    <!-- Card 4: Шах клуб & Плетиво -->
    <g transform="translate(322, 342)">
      <rect width="248" height="44" rx="13" fill="#ffffff" stroke="#e3def5" stroke-width="1.2" filter="url(#pillShadow)"/>
      <rect x="7" y="7" width="30" height="30" rx="8" fill="#fdf2f8"/>
      <!-- Chess Crown Vector Icon -->
      <g transform="translate(12, 12) scale(0.85)">
        <path d="M4 19h16 M5 19V7l3.5 3.5L12 4l3.5 6.5L19 7v12" fill="none" stroke="#db2777" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="5" cy="7" r="1.2" fill="#db2777"/>
        <circle cx="12" cy="4" r="1.2" fill="#db2777"/>
        <circle cx="19" cy="7" r="1.2" fill="#db2777"/>
      </g>
      <text x="48" y="28" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="14.5" font-weight="700" fill="#312658">Шах клуб &amp; Плетиво</text>
    </g>

    <!-- Card 5: Арт работилници & Читателски клуб -->
    <g transform="translate(60, 396)">
      <rect width="510" height="44" rx="13" fill="#ffffff" stroke="#e3def5" stroke-width="1.2" filter="url(#pillShadow)"/>
      <rect x="7" y="7" width="30" height="30" rx="8" fill="#ecfdf5"/>
      <!-- Artist Palette Vector Icon -->
      <g transform="translate(12, 12) scale(0.85)">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 2 6.8 5 8.3.6.3 1.3-.1 1.3-.8v-.5c0-1.1.9-2 2-2h1.2c2.6 0 4.8-2.1 4.8-4.8 0-.4-.1-.7-.2-1.1C18 10 22 7.5 22 12c0-5.5-4.5-10-10-10z" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="7.5" cy="10.5" r="1.5" fill="#059669"/>
        <circle cx="12" cy="7.5" r="1.5" fill="#059669"/>
        <circle cx="16.5" cy="10.5" r="1.5" fill="#059669"/>
      </g>
      <text x="48" y="28" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="14.5" font-weight="700" fill="#312658">Арт работилници • Читателски клуб „Лигериа“</text>
    </g>

    <!-- BOTTOM HERO CONTACT BANNER -->
    <g transform="translate(60, 464)">
      <rect width="510" height="114" rx="22" fill="url(#purpleGrad)" filter="url(#badgeShadow)"/>

      <!-- Left: Website -->
      <g transform="translate(24, 26)">
        <rect width="44" height="44" rx="12" fill="#ffffff" fill-opacity="0.18"/>
        <!-- Globe vector -->
        <circle cx="22" cy="22" r="12" fill="none" stroke="#ffffff" stroke-width="2"/>
        <line x1="10" y1="22" x2="34" y2="22" stroke="#ffffff" stroke-width="1.8"/>
        <path d="M22 10 C 26 14, 26 30, 22 34 C 18 30, 18 14, 22 10" fill="none" stroke="#ffffff" stroke-width="1.8"/>

        <text x="56" y="18" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#dedaff" letter-spacing="1">ОФИЦИАЛЕН САЙТ</text>
        <text x="56" y="40" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="19" font-weight="800" fill="#ffffff" letter-spacing="0.5">www.umenie.net</text>
      </g>

      <!-- Vertical divider -->
      <line x1="268" y1="20" x2="268" y2="94" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.5"/>

      <!-- Right: Phone -->
      <g transform="translate(286, 26)">
        <rect width="44" height="44" rx="12" fill="#ffffff" fill-opacity="0.18"/>
        <!-- Phone vector -->
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#ffffff" transform="translate(10, 10) scale(0.95)"/>

        <text x="54" y="18" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="11.5" font-weight="700" fill="#dedaff" letter-spacing="1">ЗАПИСВАНЕ И ИНФО</text>
        <text x="54" y="40" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="19" font-weight="800" fill="#ffffff" letter-spacing="0.5">0877 488 481</text>
      </g>
    </g>

    <!-- ==================== RIGHT FLOATING BADGE ==================== -->
    <g transform="translate(635, 508)">
      <rect width="480" height="54" rx="18" fill="#ffffff" fill-opacity="0.95" stroke="#887ed8" stroke-width="1.5" stroke-opacity="0.6" filter="url(#badgeShadow)"/>
      
      <!-- Sparkle Star Icon -->
      <circle cx="30" cy="27" r="14" fill="#f5eeff"/>
      <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z" fill="#887ed8" transform="translate(18, 15) scale(0.9)"/>

      <text x="56" y="34" font-family="Segoe UI, -apple-system, Montserrat, Arial, sans-serif" font-size="16" font-weight="800" fill="#3b2b78">
        Растем с едно умение повече всеки ден!
      </text>
    </g>
  </svg>
  `;

  // Step 1: Render base background + frame
  const baseBuffer = await sharp(Buffer.from(bgSvg))
    .png()
    .toBuffer();

  // Step 2: Composite photo and logo onto base
  const midBuffer = await sharp(baseBuffer)
    .composite([
      { input: croppedPhoto, top: 50, left: 610 },
      { input: trimmedLogo, top: 130, left: 60 },
    ])
    .png()
    .toBuffer();

  // Step 3: Composite foreground vector SVG (containing text, badges, floating overlay over the photo)
  const fgBuffer = Buffer.from(fgSvg);
  const finalPngBuffer = await sharp(midBuffer)
    .composite([{ input: fgBuffer, top: 0, left: 0 }])
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  const finalJpgBuffer = await sharp(midBuffer)
    .composite([{ input: fgBuffer, top: 0, left: 0 }])
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toBuffer();

  // Write to all target locations
  const targets = [
    { p: path.join(__dirname, '../public/og-image.jpg'), b: finalJpgBuffer },
    { p: path.join(__dirname, '../public/og-image.png'), b: finalPngBuffer },
    { p: path.join(__dirname, '../src/app/opengraph-image.jpg'), b: finalJpgBuffer },
    { p: path.join(__dirname, '../src/app/opengraph-image.png'), b: finalPngBuffer },
    { p: path.join(__dirname, '../src/app/twitter-image.jpg'), b: finalJpgBuffer },
    { p: path.join(__dirname, '../src/app/twitter-image.png'), b: finalPngBuffer },
  ];

  for (const t of targets) {
    fs.writeFileSync(t.p, t.b);
    console.log('Saved:', t.p, 'size:', t.b.length);
  }
}

createEliteOgImage()
  .then(() => console.log('Elite OG Image generated successfully!'))
  .catch(err => console.error('Error:', err));
