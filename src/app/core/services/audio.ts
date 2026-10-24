import { Service, signal } from '@angular/core';

/**
 * Tiny Web Audio engine for UI feedback (blips on hover/drag/click).
 * The AudioContext is created lazily on the first user gesture, as
 * browsers require. Muted by default.
 */
@Service()
export class AudioEngine {
  private ctx?: AudioContext;

  readonly enabled = signal(false);

  toggle(): void {
    this.enabled.update((on) => !on);
    if (this.enabled()) {
      this.ctx ??= new AudioContext();
      void this.ctx.resume();
      this.blip(880);
    }
  }

  blip(frequency = 440, duration = 0.08, type: OscillatorType = 'square'): void {
    if (!this.enabled() || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
}
