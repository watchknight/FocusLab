import { CheckResult } from '@/store/types';

/**
 * Generates a 1080 x 1350 share card canvas image complying with docs/DESIGN-V3.md Section 10:
 * - Dimensions: 1080 x 1350 (portrait 4:5)
 * - Visual elements: Viewfinder HUD, the photographic Lens, user median RT, test date
 * - Honesty rules: zero medical/health claims, zero ADHD wording, pure measurement metrics
 */
export function drawShareCard(canvas: HTMLCanvasElement, result: CheckResult): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  // 1. Dark Viewfinder Stage Background
  ctx.fillStyle = '#07080B';
  ctx.fillRect(0, 0, width, height);

  const bgGrad = ctx.createRadialGradient(width / 2, 540, 50, width / 2, 540, 600);
  bgGrad.addColorStop(0, 'rgba(20, 23, 30, 0.7)');
  bgGrad.addColorStop(1, 'rgba(7, 8, 11, 0)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Viewfinder 4 Corner HUD marks (48px, 3px stroke, 55% opacity)
  ctx.strokeStyle = 'rgba(242, 243, 245, 0.55)';
  ctx.lineWidth = 3;
  const margin = 56;
  const bSize = 48;
  const corners: [number, number, number, number, number, number][] = [
    [margin, margin + bSize, margin, margin, margin + bSize, margin],
    [width - margin - bSize, margin, width - margin, margin, width - margin, margin + bSize],
    [margin, height - margin - bSize, margin, height - margin, margin + bSize, height - margin],
    [width - margin - bSize, height - margin, width - margin, height - margin, width - margin, height - margin - bSize],
  ];
  ctx.beginPath();
  for (const [x1, y1, x2, y2, x3, y3] of corners) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
  }
  ctx.stroke();

  // 3. Top Header: FocusLab Brand & HUD Readout
  ctx.textAlign = 'left';
  ctx.fillStyle = '#F2F3F5';
  ctx.font = 'bold 36px "Bricolage Grotesque", -apple-system, sans-serif';
  ctx.fillText('FocusLab', margin, margin + 40);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#9AA1AE';
  ctx.font = '500 20px "Martian Mono", monospace';
  ctx.fillText('Check (PVT-B)', width - margin, margin + 38);

  // 4. Center Graphic: The Photographic Lens
  const cx = width / 2;
  const cy = 530;
  const outerR = 250;

  // Lens Housing outer rings
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2A2F3B';
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 10, 0, Math.PI * 2);
  ctx.stroke();

  // Lens coatings iridescent subtle arcs
  const coatings = [
    { color: 'rgba(192, 60, 255, 0.40)', start: -0.6, end: 0.8 },
    { color: 'rgba(53, 255, 165, 0.35)', start: 1.2, end: 2.4 },
    { color: 'rgba(255, 184, 74, 0.30)', start: 2.8, end: 4.0 },
  ];
  ctx.lineWidth = 3;
  for (const coating of coatings) {
    ctx.strokeStyle = coating.color;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 6, coating.start, coating.end);
    ctx.stroke();
  }

  // Lens barrel fill
  ctx.fillStyle = '#14171E';
  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2A2F3B';
  ctx.stroke();

  // Aperture iris ring
  ctx.fillStyle = '#0C0E13';
  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.fill();

  // Center optical glass & stimulus core
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, Math.PI * 2);
  ctx.fill();

  // AF Crosshair brackets
  ctx.strokeStyle = 'rgba(154, 161, 174, 0.6)';
  ctx.lineWidth = 2;
  const crossSize = 16;
  ctx.beginPath();
  ctx.moveTo(cx - 80, cy);
  ctx.lineTo(cx - 80 + crossSize, cy);
  ctx.moveTo(cx + 80, cy);
  ctx.lineTo(cx + 80 - crossSize, cy);
  ctx.moveTo(cx, cy - 80);
  ctx.lineTo(cx, cy - 80 + crossSize);
  ctx.moveTo(cx, cy + 80);
  ctx.lineTo(cx, cy + 80 - crossSize);
  ctx.stroke();

  // 5. Result Metric Display (below the lens)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9AA1AE';
  ctx.font = '600 22px "Martian Mono", monospace';
  ctx.fillText('Median reaction time', cx, 890);

  ctx.fillStyle = '#F2F3F5';
  ctx.font = 'bold 120px "Bricolage Grotesque", -apple-system, sans-serif';
  ctx.fillText(`${result.metrics.medianRt}`, cx - 40, 1020);

  ctx.fillStyle = '#9AA1AE';
  ctx.font = '500 48px "Bricolage Grotesque", -apple-system, sans-serif';
  ctx.fillText('ms', cx + 150, 1010);

  // Secondary metrics (grammatically correct singular/plural)
  const lapsesText = `${result.metrics.lapses} ${result.metrics.lapses === 1 ? 'lapse' : 'lapses'} (≥355ms)`;
  const falseStartsText = `${result.metrics.falseStarts} ${result.metrics.falseStarts === 1 ? 'false start' : 'false starts'} (<100ms)`;
  ctx.fillStyle = '#A3A9B5';
  ctx.font = '500 26px "Bricolage Grotesque", -apple-system, sans-serif';
  ctx.fillText(`${lapsesText},  ${falseStartsText}`, cx, 1080);

  // 6. Footer Metadata Strip
  ctx.strokeStyle = '#2A2F3B';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, 1220);
  ctx.lineTo(width - margin, 1220);
  ctx.stroke();

  const formattedDate = new Date(result.ts).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = '#9AA1AE';
  ctx.font = '500 24px "Martian Mono", monospace';
  ctx.fillText(formattedDate, margin, 1265);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#9AA1AE';
  ctx.font = '500 24px "Martian Mono", monospace';
  ctx.fillText('focuslab.app', width - margin, 1265);
}

export function generateShareCardBlob(result: CheckResult): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof document === 'undefined') {
        resolve(new Blob([], { type: 'image/png' }));
        return;
      }
      const canvas = document.createElement('canvas');
      drawShareCard(canvas, result);

      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create canvas blob'));
          },
          'image/png',
          0.95
        );
      } else if (typeof canvas.toDataURL === 'function') {
        const dataUrl = canvas.toDataURL('image/png');
        const binStr = atob(dataUrl.split(',')[1] || '');
        const len = binStr.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) arr[i] = binStr.charCodeAt(i);
        resolve(new Blob([arr], { type: 'image/png' }));
      } else {
        reject(new Error('Canvas rasterization not supported'));
      }
    } catch (err) {
      reject(err);
    }
  });
}

export async function shareOrDownloadCard(result: CheckResult): Promise<void> {
  const blob = await generateShareCardBlob(result);
  const formattedDate = new Date(result.ts).toISOString().slice(0, 10);
  const filename = `focuslab-check-${formattedDate}.png`;

  let file: File | null = null;
  try {
    if (typeof File !== 'undefined') {
      file = new File([blob], filename, { type: 'image/png' });
    }
  } catch {
    file = null;
  }

  if (
    file &&
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title: 'FocusLab — Reaction Time Baseline',
        text: `My median reaction time was ${result.metrics.medianRt} ms on FocusLab.`,
        files: [file],
      });
      return;
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
    }
  }

  if (typeof document !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
