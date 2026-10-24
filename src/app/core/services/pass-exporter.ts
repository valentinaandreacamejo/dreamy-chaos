import { DOCUMENT, Service, inject } from '@angular/core';
import { ASSETS } from '../festival';
import { TicketColor, TicketTier, barcodeFromCode } from './ticket';

export interface PassData {
  holder: string;
  tier: TicketTier;
  code: string;
  color: TicketColor;
  perk: string;
}

const COLORS: Record<TicketColor, string> = {
  'acid-yellow': '#E8FF00',
  fuchsia: '#FF007A',
  purple: '#7000FF',
  cyan: '#00F0FF',
};

const W = 1000;
const H = 1600;

/**
 * Renders the festival pass to a PNG with the Canvas API and downloads it.
 * Drawn by hand (not a DOM screenshot) so it's dependency-free and the
 * output is crisp regardless of the on-screen 3D transform.
 */
@Service()
export class PassExporter {
  private readonly document = inject(DOCUMENT);

  async download(pass: PassData): Promise<void> {
    await this.document.fonts.ready;
    const canvas = this.document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    const accent = COLORS[pass.color];

    // Card body
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 80);
    ctx.clip();

    const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
    bg.addColorStop(0, '#7000FF');
    bg.addColorStop(0.7, '#0E0E12');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W * 0.2, H * 0.1, 0, W * 0.2, H * 0.1, W * 0.9);
    glow.addColorStop(0, accent);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Holo sheen
    const holo = ctx.createLinearGradient(0, H * 0.3, W, H * 0.6);
    holo.addColorStop(0, 'rgba(0,240,255,0)');
    holo.addColorStop(0.45, 'rgba(0,240,255,0.25)');
    holo.addColorStop(0.55, 'rgba(255,0,122,0.25)');
    holo.addColorStop(1, 'rgba(255,0,122,0)');
    ctx.fillStyle = holo;
    ctx.fillRect(0, 0, W, H);

    // Sticker
    const sticker = await loadImage(ASSETS.stickers.smileyFlower);
    ctx.drawImage(sticker, W - 420, 90, 340, 340);

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 34px "Space Mono", monospace';
    ctx.fillText('DREAMY CHAOS · 2026', 80, 130);

    ctx.fillStyle = accent;
    ctx.font = '800 120px Syne, sans-serif';
    pass.tier.split(' ').forEach((word, i) => ctx.fillText(word, 80, 640 + i * 120));

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '700 28px "Space Mono", monospace';
    ctx.fillText(pass.perk, 80, 900);
    ctx.fillText('HOLDER', 80, 1010);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 72px Outfit, sans-serif';
    ctx.fillText(pass.holder, 80, 1090, W - 160);

    // Barcode strip
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 1200, W, 400);
    ctx.fillStyle = '#0E0E12';
    let x = 80;
    for (const bar of barcodeFromCode(pass.code)) {
      ctx.fillRect(x, 1250, bar * 4, 200);
      x += bar * 4 + 8;
      if (x > W - 80) break;
    }
    ctx.font = '700 40px "Space Mono", monospace';
    ctx.fillText(pass.code, 80, 1520);
    ctx.restore();

    const link = this.document.createElement('a');
    link.download = `dreamy-chaos-pass-${slug(pass.holder)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'guest';
}
