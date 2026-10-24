import { Component, ElementRef, computed, effect, input, model, untracked, viewChild } from '@angular/core';
import { ASSETS } from '../../../core/festival';
import { TicketColor, TicketTier, barcodeFromCode } from '../../../core/services/ticket';
import { Tilt3d } from '../../directives/tilt-3d';

/**
 * Holographic festival pass.
 *   .spinner → idle sway + full 360° spin whenever the tier changes
 *   .pass    → pointer tilt (Tilt3d) + flip (click or `flipped` model)
 */
@Component({
  selector: 'app-ticket-pass',
  imports: [Tilt3d],
  styleUrl: './ticket-pass-3d.scss',
  templateUrl: './ticket-pass-3d.html',
})
export class TicketPass3d {
  readonly holder = input('YOUR NAME');
  readonly tier = input<TicketTier>('DREAMY CLUBBER');
  readonly perk = input('');
  readonly code = input('DC26-XXX-0000-0000');
  readonly color = input<TicketColor>('fuchsia');
  readonly flipped = model(false);

  protected readonly sticker = ASSETS.stickers.smileyFlower;
  protected readonly barcode = computed(() => barcodeFromCode(this.code()));
  protected readonly tierWords = computed(() => this.tier().split(' '));

  private readonly spinner = viewChild.required<ElementRef<HTMLElement>>('spinner');

  constructor() {
    let first = true;
    effect(() => {
      this.tier();
      if (first) {
        first = false;
        return;
      }
      untracked(() => this.spin());
    });
  }

  spin(): void {
    this.spinner().nativeElement.animate(
      [{ transform: 'rotateY(0deg) scale(1)' }, { transform: 'rotateY(180deg) scale(0.9)' }, { transform: 'rotateY(360deg) scale(1)' }],
      { duration: 900, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    );
  }
}
