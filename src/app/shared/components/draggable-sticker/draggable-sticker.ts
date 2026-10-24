import { Component, computed, inject, input, signal } from '@angular/core';
import { AudioEngine } from '../../../core/services/audio';
import { PointerTracker } from '../../../core/services/pointer';
import { Draggable } from '../../directives/draggable';

let topLayer = 0;

/**
 * Absolutely-positioned wrapper that turns any projected content (PNG
 * sticker, SVG, badge…) into a sticker the user can throw around.
 *
 * Three stacked motion layers so they never fight over `transform`:
 *   host      → drag (Draggable directive)
 *   .parallax → follows the cursor by `depth` px and tilts towards it
 *   .float    → idle CSS float animation
 *
 * <app-draggable-sticker [x]="12" [y]="30" [rotation]="-8" [depth]="30">
 *   <img src="…" alt="" />
 * </app-draggable-sticker>
 */
@Component({
  selector: 'app-draggable-sticker',
  styleUrl: './draggable-sticker.scss',
  templateUrl: './draggable-sticker.html',
  hostDirectives: [
    {
      directive: Draggable,
      inputs: ['bounds', 'rotation', 'dragDisabled'],
      outputs: ['dragStart', 'dragEnd'],
    },
  ],
  host: {
    '[style.left.%]': 'x()',
    '[style.top.%]': 'y()',
    '[style.width]': 'size()',
    '[style.z-index]': 'layer()',
    '[style.--float-delay]': 'floatDelay() + "s"',
    '[class.is-floating]': 'float()',
  },
})
export class DraggableSticker {
  /** Initial position, % of the positioned parent. */
  readonly x = input(0);
  readonly y = input(0);
  /** Any CSS length, e.g. '9rem' or 'clamp(6rem, 12vw, 11rem)'. */
  readonly size = input<string | null>(null);
  readonly float = input(true);
  readonly floatDelay = input(0);
  /** Cursor parallax distance in px. Negative values move against the cursor. */
  readonly depth = input(20);
  /** Max tilt in degrees towards the cursor. */
  readonly tilt = input(14);

  private readonly draggable = inject(Draggable);
  private readonly pointer = inject(PointerTracker);
  private readonly audio = inject(AudioEngine);

  protected readonly layer = signal<number | null>(null);

  protected readonly parallax = computed(() => {
    if (this.draggable.dragging()) return 'none';
    const px = this.pointer.x();
    const py = this.pointer.y();
    const d = this.depth();
    const t = this.tilt();
    return (
      `translate3d(${px * d}px, ${py * d}px, 0) ` +
      `rotateX(${-py * t}deg) rotateY(${px * t}deg)`
    );
  });

  constructor() {
    this.draggable.dragStart.subscribe(() => {
      this.layer.set(50 + ++topLayer);
      this.audio.blip(520);
    });
    this.draggable.dragEnd.subscribe(() => this.audio.blip(330, 0.06, 'triangle'));
  }
}
