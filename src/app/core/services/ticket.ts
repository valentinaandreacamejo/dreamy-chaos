import { Service, computed, signal } from '@angular/core';

export type TicketTier = 'VIP STAGE' | 'DREAMY CLUBBER' | 'BACKSTAGE';
export type TicketColor = 'acid-yellow' | 'fuchsia' | 'purple' | 'cyan';

export interface TierInfo {
  tier: TicketTier;
  short: string;
  color: TicketColor;
  perk: string;
}

export const TICKET_TIERS: readonly TierInfo[] = [
  { tier: 'DREAMY CLUBBER', short: 'DRM', color: 'fuchsia', perk: 'ALL STAGES · 3 DAYS' },
  { tier: 'VIP STAGE', short: 'VIP', color: 'acid-yellow', perk: 'FRONT PIT · LOUNGE ACCESS' },
  { tier: 'BACKSTAGE', short: 'BKS', color: 'cyan', perk: 'ARTIST AREA · AFTERPARTY' },
];

/** State of the personalised festival pass built in the ticket generator. */
@Service()
export class TicketStore {
  readonly holder = signal('');
  readonly tier = signal<TicketTier>('DREAMY CLUBBER');
  private readonly seed = signal(Math.random());

  readonly info = computed(() => TICKET_TIERS.find((t) => t.tier === this.tier())!);
  readonly color = computed(() => this.info().color);
  readonly displayName = computed(() => this.holder().trim().toUpperCase() || 'YOUR NAME');

  /** Deterministic pseudo-code from holder + tier + seed, e.g. DC26-VIP-7F3A-K9Q2 */
  readonly code = computed(() => {
    const source = `${this.holder().trim().toUpperCase()}|${this.tier()}|${this.seed()}`;
    let hash = 0;
    for (const char of source) hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
    const chunk = (hash >>> 0).toString(36).toUpperCase().padStart(8, '0');
    return `DC26-${this.info().short}-${chunk.slice(0, 4)}-${chunk.slice(4, 8)}`;
  });

  reroll(): void {
    this.seed.set(Math.random());
  }
}

/** Bar widths (1–4) derived from the code, so the barcode changes with it. */
export function barcodeFromCode(code: string, bars = 48): number[] {
  const chars = code.replace(/-/g, '');
  return Array.from({ length: bars }, (_, i) => 1 + ((chars.charCodeAt(i % chars.length) * (i + 7)) % 4));
}
