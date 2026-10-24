import { Directive, ElementRef, computed, inject, input, signal } from '@angular/core';

/**
 * Pointer-driven 3D tilt. Rotates the host towards the cursor and exposes
 * `--tilt-x`, `--tilt-y` (deg) and `--glare-x`, `--glare-y` (%) so styles
 * can add holographic glare or parallax layers (see `.depth-*` utilities).
 */
@Directive({
  selector: '[appTilt3d]',
  host: {
    '[style.transform]': 'transform()',
    '[style.transform-style]': '"preserve-3d"',
    '[style.transition]': 'active() ? "transform 80ms linear" : "transform 700ms var(--ease-bounce)"',
    '[style.--tilt-x]': 'rotateX() + "deg"',
    '[style.--tilt-y]': 'rotateY() + "deg"',
    '[style.--glare-x]': 'glare().x + "%"',
    '[style.--glare-y]': 'glare().y + "%"',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerleave)': 'onPointerLeave()',
  },
})
export class Tilt3d {
  /** Maximum rotation in degrees on each axis. */
  readonly maxTilt = input(18);
  readonly perspective = input(1000);
  readonly hoverScale = input(1.04);
  /** Extra rotateY added on top of the tilt (e.g. 180 to show the back face). */
  readonly flipY = input(0);

  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  protected readonly active = signal(false);
  protected readonly rotateX = signal(0);
  protected readonly rotateY = signal(0);
  protected readonly glare = signal({ x: 50, y: 50 });

  protected readonly transform = computed(
    () =>
      `perspective(${this.perspective()}px) rotateX(${this.rotateX()}deg) ` +
      `rotateY(${this.rotateY() + this.flipY()}deg) scale(${this.active() ? this.hoverScale() : 1})`,
  );

  protected onPointerMove(event: PointerEvent): void {
    const rect = this.el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const max = this.maxTilt();

    this.active.set(true);
    this.rotateY.set((px - 0.5) * 2 * max);
    this.rotateX.set(-(py - 0.5) * 2 * max);
    this.glare.set({ x: px * 100, y: py * 100 });
  }

  protected onPointerLeave(): void {
    this.active.set(false);
    this.rotateX.set(0);
    this.rotateY.set(0);
    this.glare.set({ x: 50, y: 50 });
  }
}
