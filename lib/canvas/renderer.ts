import { TemplateConfig, MenfessConfig, DecorationElement, fontSizeMap } from '@/types/template';

const OUTPUT_SIZE = 1080;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
  fontSize: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    // Handle explicit newlines
    const parts = word.split('\n');
    for (let i = 0; i < parts.length; i++) {
      const testLine = currentLine ? `${currentLine} ${parts[i]}` : parts[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = parts[i];
      } else {
        currentLine = testLine;
      }
      if (i < parts.length - 1) {
        lines.push(currentLine);
        currentLine = '';
      }
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawTornPaper(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
): void {
  ctx.save();
  ctx.fillStyle = color;

  // Draw main rect
  ctx.fillRect(x, y + 20, w, h - 20);

  // Torn top edge
  ctx.beginPath();
  ctx.moveTo(x, y + 20);
  const segments = 28;
  const segW = w / segments;
  for (let i = 0; i <= segments; i++) {
    const px = x + i * segW;
    const py = y + 20 + (Math.sin(i * 2.1) * 10 + Math.cos(i * 3.3) * 6);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.lineTo(x + w, y + 20);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();

  // Torn shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 20);
  for (let i = 0; i <= segments; i++) {
    const px = x + i * segW;
    const py = y + 20 + (Math.sin(i * 2.1) * 10 + Math.cos(i * 3.3) * 6);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  fill: string,
  strokeColor?: string,
  strokeWidth?: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fill && fill !== 'transparent') {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (strokeColor && strokeWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

function drawDecoration(ctx: CanvasRenderingContext2D, dec: DecorationElement): void {
  ctx.save();
  if (dec.opacity !== undefined) ctx.globalAlpha = dec.opacity;

  switch (dec.type) {
    case 'rect': {
      const fill = dec.color || 'transparent';
      const radius = (dec as any).borderRadius || 0;
      if (radius > 0) {
        drawRoundedRect(
          ctx,
          dec.x,
          dec.y,
          dec.width ?? 0,
          dec.height ?? 0,
          radius,
          fill,
          dec.strokeColor,
          dec.strokeWidth,
        );
      } else {
        if (fill !== 'transparent') {
          ctx.fillStyle = fill;
          ctx.fillRect(dec.x, dec.y, dec.width ?? 0, dec.height ?? 0);
        }
        if (dec.strokeColor && dec.strokeWidth) {
          ctx.strokeStyle = dec.strokeColor;
          ctx.lineWidth = dec.strokeWidth;
          ctx.strokeRect(dec.x, dec.y, dec.width ?? 0, dec.height ?? 0);
        }
      }
      break;
    }
    case 'line': {
      const x1 = dec.x * OUTPUT_SIZE;
      const y1 = dec.y * OUTPUT_SIZE;
      const x2 = x1 + (dec.width ?? 0) * OUTPUT_SIZE;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.strokeStyle = dec.color || '#000';
      ctx.lineWidth = dec.strokeWidth || 1;
      ctx.stroke();
      break;
    }
    case 'text': {
      const align = dec.alignment || 'left';
      ctx.textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      const weight = dec.fontWeight || 'normal';
      const size = dec.fontSize || 14;
      ctx.font = `${weight} ${size}px ${dec.fontFamily || 'sans-serif'}`;
      ctx.fillStyle = dec.textColor || '#000';
      if (dec.letterSpacing) (ctx as unknown as Record<string, unknown>).letterSpacing = `${dec.letterSpacing}px`;
      ctx.fillText(dec.text || '', dec.x, dec.y);
      (ctx as unknown as Record<string, unknown>).letterSpacing = '0px';
      break;
    }
    case 'badge': {
      // Soft glow circle
      const grd = ctx.createRadialGradient(dec.x, dec.y, 0, dec.x, dec.y, (dec.width ?? 200) / 2);
      grd.addColorStop(0, dec.color || 'rgba(255,255,255,0.15)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(dec.x, dec.y, (dec.width ?? 200) / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'torn-paper': {
      const x = dec.x * OUTPUT_SIZE;
      const y = dec.y * OUTPUT_SIZE;
      const w = (dec.width ?? 0) * OUTPUT_SIZE;
      const h = (dec.height ?? 0) * OUTPUT_SIZE;
      drawTornPaper(ctx, x, y, w, h, dec.color || '#ffffff');
      break;
    }
  }

  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D, template: TemplateConfig): void {
  const { width, height, backgroundType, backgroundColor, gradientColors } = template;

  if (backgroundType === 'gradient' && gradientColors && gradientColors.length >= 2) {
    const grd = ctx.createLinearGradient(0, 0, width * 0.5, height);
    gradientColors.forEach((color, i) => {
      grd.addColorStop(i / (gradientColors.length - 1), color);
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // Add subtle noise texture for depth
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  } else if (backgroundType === 'texture') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Paper texture noise
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 12000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawInstagramBoxCard(
  ctx: CanvasRenderingContext2D,
  template: TemplateConfig,
  config: MenfessConfig,
): void {
  const custom = config.customColors;
  const frameColor = custom?.frameColor || template.backgroundColor || '#D8000C';
  const bgInner = custom?.bgInnerColor || '#FFFFFF';
  const cardColor = custom?.cardColor || template.textAreaBackground || '#17212F';
  const textColor = custom?.textColor || '#FFFFFF';
  const titleColor = custom?.titleColor || template.titleStyle.color || '#000000';

  // 1. Draw outer full frame
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  // 2. Inner card dimensions
  const frameThickness = 92;
  const innerX = frameThickness;
  const innerY = frameThickness;
  const innerW = OUTPUT_SIZE - frameThickness * 2;
  const innerH = OUTPUT_SIZE - frameThickness * 2;

  // Fill inner white card
  ctx.fillStyle = bgInner;
  ctx.fillRect(innerX, innerY, innerW, innerH);

  // Stroke thin black border around inner card
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.strokeRect(innerX, innerY, innerW, innerH);

  // 3. Title: "MENFESS!!"
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 56px "Montserrat", "Arial Black", "Arial", sans-serif';
  ctx.fillStyle = titleColor;
  (ctx as unknown as Record<string, unknown>).letterSpacing = '4px';
  ctx.fillText(template.titleText || 'MENFESS!!', OUTPUT_SIZE / 2, 260);
  (ctx as unknown as Record<string, unknown>).letterSpacing = '0px';
  ctx.restore();

  // 4. Center message card box
  const cardW = 750;
  const cardX = (OUTPUT_SIZE - cardW) / 2;
  const cardRadius = 8;

  // Format fields
  const recipient = config.recipientName?.trim() || 'semua';
  const sender = config.isAnonymous
    ? (config.senderName?.trim() || 'ada lah')
    : (config.senderName?.trim() || 'Anonim');
  const note = config.message?.trim() || 'info tomboy wolfcut cik😋';
  const song = config.song?.trim() || 'bebas';

  const fontSizeMult = fontSizeMap[config.fontSize] ?? 1.0;
  const fontSize = Math.round(28 * fontSizeMult);
  const lineHeight = Math.round(fontSize * 1.55);

  ctx.save();
  ctx.font = `bold ${fontSize}px "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", sans-serif`;

  const notePrefix = 'Note: ';
  const noteMaxWidth = cardW - 70;
  const noteWrapped = wrapText(ctx, `${notePrefix}${note}`, noteMaxWidth, lineHeight, fontSize);

  // Total lines: To, From, Note (1 or more lines), Song
  const totalLinesCount = 2 + noteWrapped.length + 1;
  const verticalPadding = 38;
  const computedCardH = Math.max(220, totalLinesCount * lineHeight + verticalPadding * 2);
  const cardY = 440;

  // Draw center card box
  drawRoundedRect(ctx, cardX, cardY, cardW, computedCardH, cardRadius, cardColor);

  // Draw text lines
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let currentY = cardY + verticalPadding + lineHeight / 2;

  // To
  ctx.fillText(`To: ${recipient}`, OUTPUT_SIZE / 2, currentY);
  currentY += lineHeight;

  // From
  ctx.fillText(`From: ${sender}`, OUTPUT_SIZE / 2, currentY);
  currentY += lineHeight;

  // Note (wrapped)
  for (let i = 0; i < noteWrapped.length; i++) {
    ctx.fillText(noteWrapped[i], OUTPUT_SIZE / 2, currentY);
    currentY += lineHeight;
  }

  // Song
  ctx.fillText(`Song: ${song}`, OUTPUT_SIZE / 2, currentY);

  ctx.restore();
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  template: TemplateConfig,
  config: MenfessConfig,
  scale: number = 1,
): void {
  const size = OUTPUT_SIZE * scale;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Custom template handler for instagram-card
  if (template.id === 'instagram-card') {
    drawInstagramBoxCard(ctx, template, config);
    return;
  }

  // Background
  const effectiveTemplate = {
    ...template,
    backgroundColor: config.customColors?.frameColor || template.backgroundColor,
    textAreaBackground: config.customColors?.cardColor || template.textAreaBackground,
    textStyle: {
      ...template.textStyle,
      color: config.customColors?.textColor || template.textStyle.color,
    },
  };

  drawBackground(ctx, effectiveTemplate);

  // Decorations (those that should render UNDER text area)
  const underDecorations = effectiveTemplate.decorations.filter(
    (d) => d.type === 'rect' || d.type === 'badge' || d.type === 'torn-paper',
  );
  underDecorations.forEach((dec) => drawDecoration(ctx, dec));

  // Text area background
  const ta = effectiveTemplate.textAreaPosition;
  const taX = ta.x * OUTPUT_SIZE;
  const taY = ta.y * OUTPUT_SIZE;
  const taW = ta.width * OUTPUT_SIZE;
  const taH = ta.height * OUTPUT_SIZE;

  if (template.textAreaBackground && template.textAreaBackground !== 'transparent') {
    const bg = template.textAreaBackground;
    if (bg.startsWith('rgba') || bg.startsWith('rgb')) {
      // Glass effect
      ctx.save();
      // Backdrop blur simulation (soft inner glow)
      const innerGlow = ctx.createLinearGradient(taX, taY, taX, taY + taH);
      innerGlow.addColorStop(0, 'rgba(255,255,255,0.12)');
      innerGlow.addColorStop(1, 'rgba(255,255,255,0.04)');
      drawRoundedRect(ctx, taX, taY, taW, taH, template.textAreaBorderRadius || 0, bg);
      drawRoundedRect(
        ctx,
        taX,
        taY,
        taW,
        taH,
        template.textAreaBorderRadius || 0,
        'transparent',
        'rgba(255,255,255,0.15)',
        1,
      );
      ctx.restore();
    } else {
      drawRoundedRect(
        ctx,
        taX,
        taY,
        taW,
        taH,
        template.textAreaBorderRadius || 0,
        bg,
      );
    }
  }

  // Draw title
  const tp = template.titlePosition;
  const ts = template.titleStyle;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${ts.fontWeight || 'bold'} ${ts.fontSize}px ${ts.fontFamily}`;
  ctx.fillStyle = ts.color;
  if (ts.letterSpacing) (ctx as unknown as Record<string, unknown>).letterSpacing = `${ts.letterSpacing}px`;
  ctx.fillText(template.titleText, tp.x * OUTPUT_SIZE, tp.y * OUTPUT_SIZE);
  (ctx as unknown as Record<string, unknown>).letterSpacing = '0px';
  ctx.restore();

  // Draw message text
  const fontSizeMult = fontSizeMap[config.fontSize] ?? 1.0;
  const msgFontSize = Math.round(template.textStyle.fontSize * fontSizeMult);
  const msgLineHeight = template.textStyle.lineHeight * msgFontSize;
  const msgPadding = 48;
  const msgMaxWidth = taW - msgPadding * 2;

  ctx.save();
  ctx.font = `${template.textStyle.fontWeight || 'normal'} ${msgFontSize}px ${template.textStyle.fontFamily}`;
  ctx.fillStyle = template.textStyle.color;

  const alignment = config.textAlignment || template.textStyle.alignment;
  ctx.textAlign = alignment === 'center' ? 'center' : alignment === 'right' ? 'right' : 'left';
  ctx.textBaseline = 'middle';

  const textLines = wrapText(
    ctx,
    config.message || 'Tulis pesan menfess kamu di sini...',
    msgMaxWidth,
    msgLineHeight,
    msgFontSize,
  );

  const totalTextHeight = textLines.length * msgLineHeight;
  const startY = taY + taH / 2 - totalTextHeight / 2 + msgLineHeight / 2;

  let textX: number;
  if (alignment === 'center') {
    textX = taX + taW / 2;
  } else if (alignment === 'right') {
    textX = taX + taW - msgPadding;
  } else {
    textX = taX + msgPadding;
  }

  textLines.forEach((line, i) => {
    const lineY = startY + i * msgLineHeight;
    // Keep within text area bounds
    if (lineY > taY + 8 && lineY < taY + taH - 8) {
      ctx.fillText(line, textX, lineY);
    }
  });
  ctx.restore();

  // Draw sender
  const senderText = config.isAnonymous
    ? '— Anonim'
    : config.senderName
      ? `— ${config.senderName}`
      : '';

  if (senderText && template.senderStyle && template.senderPosition) {
    const sp = template.senderPosition;
    const ss = template.senderStyle;
    const fontSizeS = ss.fontSize;
    ctx.save();
    ctx.font = `${ss.fontWeight || 'normal'} ${fontSizeS}px ${ss.fontFamily}`;
    ctx.fillStyle = ss.color;
    ctx.textAlign = ss.alignment === 'right' ? 'right' : ss.alignment === 'center' ? 'center' : 'left';
    ctx.textBaseline = 'middle';
    const sX =
      ss.alignment === 'right'
        ? (sp.x + sp.width) * OUTPUT_SIZE
        : ss.alignment === 'center'
          ? (sp.x + sp.width / 2) * OUTPUT_SIZE
          : sp.x * OUTPUT_SIZE;
    const sY = (sp.y + sp.height / 2) * OUTPUT_SIZE;
    ctx.fillText(senderText, sX, sY);
    ctx.restore();
  }

  // Decorations OVER content (lines, texts, etc.)
  const overDecorations = template.decorations.filter(
    (d) => d.type === 'line' || d.type === 'text',
  );
  overDecorations.forEach((dec) => drawDecoration(ctx, dec));
}

export function exportHighRes(
  template: TemplateConfig,
  config: MenfessConfig,
): string {
  const offscreen = document.createElement('canvas');
  renderToCanvas(offscreen, template, config, 1);
  return offscreen.toDataURL('image/png', 1.0);
}

export function downloadPNG(
  template: TemplateConfig,
  config: MenfessConfig,
  filename: string = 'menfess.png',
): void {
  const dataUrl = exportHighRes(template, config);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
