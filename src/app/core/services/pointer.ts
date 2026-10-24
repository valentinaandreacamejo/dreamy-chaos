import { DOCUMENT, DestroyRef, Service, inject, signal } from '@angular/core';

/**
 * Global pointer tracker. Exposes the cursor position normalised to -1…1
 * as signals and mirrors it to the `--pointer-x` / `--pointer-y` CSS vars
 * on <html>, so any stylesheet can drive parallax without JS.
 */
@Service()
export class PointerTracker {
  private readonly document = inject(DOCUMENT);
  private readonly root = this.document.documentElement;
  private frame = 0;

  readonly x = signal(0);
  readonly y = signal(0);

  constructor() {
    const win = this.document.defaultView;
    if (!win) return;

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(() => {
        const x = (e.clientX / win.innerWidth) * 2 - 1;
        const y = (e.clientY / win.innerHeight) * 2 - 1;
        this.x.set(x);
        this.y.set(y);
        this.root.style.setProperty('--pointer-x', x.toFixed(3));
        this.root.style.setProperty('--pointer-y', y.toFixed(3));
      });
    };

    win.addEventListener('pointermove', onMove, { passive: true });
    inject(DestroyRef).onDestroy(() => {
      win.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(this.frame);
    });
  }
}
