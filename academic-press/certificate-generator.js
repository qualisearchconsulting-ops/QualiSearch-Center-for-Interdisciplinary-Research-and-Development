/* ══════════════════════════════════════════════════════════════
   QualiSearch — Certificate of International Publication Generator
   ──────────────────────────────────────────────────────────────
   Draws a premium certificate entirely via HTML Canvas.
   Dynamically inserts recipient name, publication date, and journal.
   Returns a base64 PNG string.
══════════════════════════════════════════════════════════════ */

/**
 * Generate a personalized Certificate of International Publication.
 *
 * @param {Object} options
 * @param {string} options.recipientName   – Full name of the recipient
 * @param {string} options.publicationDate – Date string (e.g. "July 1, 2026")
 * @param {string} [options.journalCode]   – Journal code, e.g. "QJERP"
 * @param {string} [options.articleTitle]   – Title of the published article
 * @returns {Promise<string>} base64 PNG data URL
 */
async function generateCertificate({
  recipientName,
  publicationDate,
  journalCode = 'QJERP',
  articleTitle = ''
}) {
  const JOURNAL_MAP = {
    QJERP: {
      full: 'QualiSearch Journal of\nEducational Research\nand Practice (QJERP)',
      tagline: 'Advancing Knowledge. Improving Education.'
    },
    QJHS: {
      full: 'QualiSearch Journal of\nHealth Sciences (QJHS)',
      tagline: 'Advancing Knowledge. Improving Health.'
    },
    QJBG: {
      full: 'QualiSearch Journal of\nBusiness and\nGovernance (QJBG)',
      tagline: 'Advancing Knowledge. Improving Governance.'
    },
    QJTI: {
      full: 'QualiSearch Journal of\nTechnology and\nInnovation (QJTI)',
      tagline: 'Advancing Knowledge. Driving Innovation.'
    },
    QJPLC: {
      full: 'QualiSearch Journal of\nPhilippine Languages\nand Culture (QJPLC)',
      tagline: 'Advancing Knowledge. Preserving Culture.'
    }
  };

  const journal = JOURNAL_MAP[journalCode] || JOURNAL_MAP.QJERP;

  // Canvas dimensions (landscape A4-ish ratio)
  const W = 1920;
  const H = 1358;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ── Colors ──
  const NAVY_DARK  = '#080d1a';
  const NAVY       = '#0e1629';
  const NAVY_MID   = '#16213a';
  const GOLD       = '#d6b25e';
  const GOLD_LIGHT = '#f3d990';
  const CREAM      = '#f5f0e3';
  const CREAM_DARK = '#e8dfc8';
  const TEXT_DARK   = '#2a1f0e';

  // ══════════════════════════════════════
  // 1. BACKGROUND
  // ══════════════════════════════════════

  // Dark navy base
  ctx.fillStyle = NAVY_DARK;
  ctx.fillRect(0, 0, W, H);

  // Inner cream parchment area
  const margin = 80;
  const parchTop = 220;
  const parchBottom = H - 180;

  // Draw rounded parchment rectangle
  drawRoundedRect(ctx, margin + 30, parchTop, W - (margin + 30) * 2, parchBottom - parchTop, 12);
  const parchGrad = ctx.createLinearGradient(0, parchTop, 0, parchBottom);
  parchGrad.addColorStop(0, '#faf6eb');
  parchGrad.addColorStop(0.3, CREAM);
  parchGrad.addColorStop(0.7, CREAM);
  parchGrad.addColorStop(1, CREAM_DARK);
  ctx.fillStyle = parchGrad;
  ctx.fill();

  // Subtle botanical/wheat pattern on parchment (decorative circles/leaves)
  ctx.save();
  ctx.globalAlpha = 0.06;
  drawBotanicalPattern(ctx, margin + 30, parchTop, W - (margin + 30) * 2, parchBottom - parchTop);
  ctx.restore();

  // ══════════════════════════════════════
  // 2. ORNATE BORDER
  // ══════════════════════════════════════

  // Outer gold border
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, margin, margin - 20, W - margin * 2, H - margin * 2 + 20, 16);
  ctx.stroke();

  // Inner gold border
  ctx.strokeStyle = GOLD_LIGHT;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, margin + 15, margin - 5, W - (margin + 15) * 2, H - (margin + 15) * 2 + 5, 12);
  ctx.stroke();

  // Corner flourishes
  drawCornerFlourish(ctx, margin + 20, margin, GOLD, 1, 1);       // top-left
  drawCornerFlourish(ctx, W - margin - 20, margin, GOLD, -1, 1);  // top-right
  drawCornerFlourish(ctx, margin + 20, H - margin, GOLD, 1, -1);  // bottom-left
  drawCornerFlourish(ctx, W - margin - 20, H - margin, GOLD, -1, -1); // bottom-right

  // ══════════════════════════════════════
  // 3. TOP HEADER AREA (Navy)
  // ══════════════════════════════════════

  // QualiSearch logo circle
  const logoX = 145;
  const logoY = 130;
  const logoR = 42;

  // Logo circle background
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
  const logoGrad = ctx.createRadialGradient(logoX, logoY, 0, logoX, logoY, logoR);
  logoGrad.addColorStop(0, '#1a3a6e');
  logoGrad.addColorStop(1, '#0d1b3a');
  ctx.fillStyle = logoGrad;
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // "Q" letter in logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 46px "EB Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Q', logoX, logoY + 2);

  // Target/magnifying glass accent on Q
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoR - 10, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Journal name next to logo
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const journalLines = journal.full.split('\n');
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 18px "EB Garamond", Georgia, serif';
  ctx.fillText('QualiSearch Journal of', logoX + logoR + 18, logoY - 38);
  
  ctx.font = 'bold 24px "EB Garamond", Georgia, serif';
  ctx.fillStyle = GOLD_LIGHT;
  // Draw remaining lines
  const remainingLines = journalLines.slice(1);
  remainingLines.forEach((line, i) => {
    ctx.fillText(line, logoX + logoR + 18, logoY - 12 + i * 28);
  });

  // Tagline
  ctx.font = 'italic 14px "Inter", "EB Garamond", sans-serif';
  ctx.fillStyle = 'rgba(214,178,94,0.7)';
  ctx.fillText(journal.tagline, logoX + logoR + 18, logoY + 50);

  // ══════════════════════════════════════
  // 4. CERTIFICATE TITLE
  // ══════════════════════════════════════

  const titleY = parchTop + 45;

  // Decorative divider above title
  drawOrnamentDivider(ctx, W / 2, titleY - 10, 280, GOLD);

  // "CERTIFICATE" text — large elegant serif
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = NAVY_DARK;
  ctx.font = '700 82px "Cinzel", "EB Garamond", Georgia, serif';
  ctx.fillText('CERTIFICATE', W / 2, titleY + 55);

  // "OF INTERNATIONAL PUBLICATION" — spaced uppercase
  ctx.font = '500 22px "Cinzel", "EB Garamond", Georgia, serif';
  ctx.fillStyle = NAVY_MID;
  ctx.letterSpacing = '6px';
  const subTitle = 'OF  INTERNATIONAL  PUBLICATION';
  ctx.fillText(subTitle, W / 2, titleY + 110);

  // Decorative divider below subtitle
  drawOrnamentDivider(ctx, W / 2, titleY + 140, 280, GOLD);

  // ══════════════════════════════════════
  // 5. ARTICLE TITLE (if provided)
  // ══════════════════════════════════════

  let nameAreaY = titleY + 220;

  if (articleTitle) {
    ctx.font = 'italic 18px "EB Garamond", Georgia, serif';
    ctx.fillStyle = '#5a4e3a';
    ctx.textAlign = 'center';

    // Wrap article title text
    const titleLines = wrapText(ctx, `"${articleTitle}"`, W - 400);
    const lineHeight = 24;
    const titleBlockY = titleY + 185;
    
    titleLines.forEach((line, i) => {
      ctx.fillText(line, W / 2, titleBlockY + i * lineHeight);
    });

    nameAreaY = titleBlockY + titleLines.length * lineHeight + 30;
  }

  // ══════════════════════════════════════
  // 6. RECIPIENT NAME
  // ══════════════════════════════════════

  // "This certificate is awarded to" text
  ctx.font = '16px "Inter", sans-serif';
  ctx.fillStyle = '#7a6f5a';
  ctx.textAlign = 'center';
  ctx.fillText('This certificate is presented to', W / 2, nameAreaY - 15);

  // Recipient name — large gold serif
  ctx.font = '700 48px "EB Garamond", Georgia, serif';
  ctx.fillStyle = '#8B6914';
  ctx.textAlign = 'center';
  ctx.fillText(recipientName, W / 2, nameAreaY + 45);

  // Gold underline beneath name
  const nameWidth = Math.min(ctx.measureText(recipientName).width + 80, W - 400);
  drawGoldLine(ctx, W / 2 - nameWidth / 2, nameAreaY + 70, nameWidth, GOLD);

  // ══════════════════════════════════════
  // 7. RECOGNITION TEXT
  // ══════════════════════════════════════

  ctx.font = '16px "Inter", sans-serif';
  ctx.fillStyle = '#7a6f5a';
  ctx.textAlign = 'center';
  ctx.fillText('in recognition of the publication of a peer-reviewed research article in the', W / 2, nameAreaY + 110);

  // Journal name reference
  const journalFullOneLine = journal.full.replace(/\n/g, ' ');
  ctx.font = 'bold 18px "EB Garamond", Georgia, serif';
  ctx.fillStyle = NAVY_MID;
  ctx.fillText(journalFullOneLine, W / 2, nameAreaY + 140);

  // ══════════════════════════════════════
  // 8. DATE
  // ══════════════════════════════════════

  const dateY = nameAreaY + 200;

  ctx.font = '16px "Inter", sans-serif';
  ctx.fillStyle = '#7a6f5a';
  ctx.textAlign = 'center';
  ctx.fillText('Date of Publication', W / 2, dateY - 10);

  // Date — styled
  ctx.font = '600 32px "EB Garamond", Georgia, serif';
  ctx.fillStyle = '#8B6914';
  ctx.fillText(publicationDate, W / 2, dateY + 30);

  // Gold underline beneath date
  const dateWidth = Math.min(ctx.measureText(publicationDate).width + 60, 400);
  drawGoldLine(ctx, W / 2 - dateWidth / 2, dateY + 50, dateWidth, GOLD);

  // ══════════════════════════════════════
  // 9. BOTTOM WAVE AND LOGOS
  // ══════════════════════════════════════

  // Dark wave at bottom
  const waveY = H - 160;
  ctx.beginPath();
  ctx.moveTo(0, waveY + 40);
  ctx.bezierCurveTo(W * 0.25, waveY - 10, W * 0.5, waveY + 60, W, waveY + 20);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();

  const waveGrad = ctx.createLinearGradient(0, waveY, 0, H);
  waveGrad.addColorStop(0, NAVY_MID);
  waveGrad.addColorStop(1, NAVY_DARK);
  ctx.fillStyle = waveGrad;
  ctx.fill();

  // Gold accent line on wave
  ctx.beginPath();
  ctx.moveTo(0, waveY + 40);
  ctx.bezierCurveTo(W * 0.25, waveY - 10, W * 0.5, waveY + 60, W, waveY + 20);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Bottom logos text
  const logoTextY = H - 75;
  const logos = [
    { text: 'QualiSearch', sub: 'ACADEMIC PRESS' },
    { text: 'Crossref', sub: 'Member' },
    { text: 'OPEN', sub: 'ACCESS' },
    { text: 'CC BY 4.0', sub: 'Creative Commons' },
    { text: 'ORCID', sub: 'Connecting Research' }
  ];

  const logoSpacing = W / (logos.length + 1);
  logos.forEach((logo, i) => {
    const x = logoSpacing * (i + 1);

    // Logo circle/badge
    ctx.beginPath();
    ctx.arc(x, logoTextY - 12, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(214,178,94,0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(214,178,94,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Logo initial
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillStyle = GOLD_LIGHT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(logo.text[0], x, logoTextY - 12);

    // Logo name
    ctx.font = '600 12px "Inter", sans-serif';
    ctx.fillStyle = '#c0b89a';
    ctx.textBaseline = 'top';
    ctx.fillText(logo.text, x, logoTextY + 12);

    // Logo subtitle
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(192,184,154,0.6)';
    ctx.fillText(logo.sub, x, logoTextY + 28);
  });

  // Separator lines between logos
  for (let i = 1; i < logos.length; i++) {
    const x = logoSpacing * i + logoSpacing / 2;
    ctx.beginPath();
    ctx.moveTo(x, logoTextY - 25);
    ctx.lineTo(x, logoTextY + 35);
    ctx.strokeStyle = 'rgba(214,178,94,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

// ══════════════════════════════════════
// HELPER DRAWING FUNCTIONS
// ══════════════════════════════════════

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawCornerFlourish(ctx, cx, cy, color, scaleX, scaleY) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scaleX, scaleY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;

  // Decorative swirl
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(15, 5, 25, 20, 20, 35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(5, 15, 20, 25, 35, 20);
  ctx.stroke();

  // Small dot
  ctx.beginPath();
  ctx.arc(8, 8, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

function drawOrnamentDivider(ctx, cx, cy, width, color) {
  const halfW = width / 2;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;

  // Left line
  ctx.beginPath();
  ctx.moveTo(cx - halfW, cy);
  ctx.lineTo(cx - 30, cy);
  ctx.stroke();

  // Right line
  ctx.beginPath();
  ctx.moveTo(cx + 30, cy);
  ctx.lineTo(cx + halfW, cy);
  ctx.stroke();

  // Center diamond
  ctx.beginPath();
  ctx.moveTo(cx, cy - 6);
  ctx.lineTo(cx + 8, cy);
  ctx.lineTo(cx, cy + 6);
  ctx.lineTo(cx - 8, cy);
  ctx.closePath();
  ctx.fill();

  // Small dots on each side
  ctx.beginPath();
  ctx.arc(cx - 20, cy, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 20, cy, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawGoldLine(ctx, x, y, width, color) {
  ctx.save();
  const grad = ctx.createLinearGradient(x, y, x + width, y);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.15, color);
  grad.addColorStop(0.85, color);
  grad.addColorStop(1, 'transparent');

  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
  ctx.restore();
}

function drawBotanicalPattern(ctx, x, y, w, h) {
  ctx.fillStyle = '#8B7355';

  // Draw subtle wheat/leaf shapes scattered across parchment
  for (let i = 0; i < 12; i++) {
    const px = x + (w * 0.1) + Math.sin(i * 2.5) * w * 0.35 + (i % 3) * w * 0.2;
    const py = y + (h * 0.15) + Math.cos(i * 1.8) * h * 0.3 + (i % 4) * h * 0.15;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((i * 0.8) + 0.3);

    // Leaf shape
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(8, -20, 20, -30, 5, -50);
    ctx.bezierCurveTo(-10, -30, -2, -20, 0, 0);
    ctx.fill();

    // Smaller leaf
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(15, -10, 25, -20, 15, -35);
    ctx.bezierCurveTo(5, -20, 10, -10, 0, 0);
    ctx.fill();

    ctx.restore();
  }
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

// Make available globally
window.generateCertificate = generateCertificate;
