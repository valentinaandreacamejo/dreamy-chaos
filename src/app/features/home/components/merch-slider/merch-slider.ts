import { Component } from '@angular/core';
import { ASSETS } from '../../../../core/festival';
import { Tilt3d } from '../../../../shared/directives/tilt-3d';

interface MerchItem {
  name: string;
  kind: string;
  price: number;
  image: string;
  imageRatio: [number, number];
  tag: string;
  color: 'acid-yellow' | 'fuchsia' | 'purple' | 'cyan';
}

/**
 * Merch showcase: a grid on desktop, a swipeable scroll-snap row on mobile.
 * Product shots are placeholders built from the sticker assets.
 */
@Component({
  selector: 'app-merch-slider',
  imports: [Tilt3d],
  styleUrl: './merch-slider.scss',
  templateUrl: './merch-slider.html',
})
export class MerchSlider {
  protected readonly items: readonly MerchItem[] = [
    {
      name: 'SMILEY ACID TEE',
      kind: 'T-SHIRT · OVERSIZE',
      price: 35,
      image: ASSETS.stickers.smileyFlower,
      imageRatio: [1280, 1280],
      tag: 'NEW DROP',
      color: 'cyan',
    },
    {
      name: 'CHROME Y2K SHADES',
      kind: 'OCCHIALI · LIMITED',
      price: 48,
      image: ASSETS.stickers.sunglasses,
      imageRatio: [1280, 800],
      tag: 'ONLY 200',
      color: 'purple',
    },
    {
      name: 'STARBURST CAP',
      kind: 'CAPPELLINO · ACID',
      price: 28,
      image: ASSETS.stickers.starburst,
      imageRatio: [1536, 1536],
      tag: 'SOLD OUT SOON',
      color: 'fuchsia',
    },
  ];
}
