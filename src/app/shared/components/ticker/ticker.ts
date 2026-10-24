import { Component, input } from '@angular/core';

export type TickerVariant = 'acid-yellow' | 'fuchsia' | 'purple' | 'cyan';

/**
 * Infinite marquee band. Content is rendered twice and translated by -50%
 * for a seamless loop. Stack two with opposite `direction` and `angle`
 * to get the crossed-tape effect.
 */
@Component({
  selector: 'app-ticker',
  styleUrl: './ticker.scss',
  templateUrl: './ticker.html',
  host: {
    '[class]': '"ticker--" + variant()',
    '[class.ticker--reverse]': 'direction() === "right"',
    '[style.--ticker-duration]': 'duration() + "s"',
    '[style.--ticker-angle]': 'angle() + "deg"',
  },
})
export class Ticker {
  readonly items = input.required<readonly string[]>();
  readonly direction = input<'left' | 'right'>('left');
  /** Seconds for one full loop: lower = faster. */
  readonly duration = input(30);
  readonly angle = input(0);
  readonly variant = input<TickerVariant>('acid-yellow');
  readonly separator = input('✺');
}
