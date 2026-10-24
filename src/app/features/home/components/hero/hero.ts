import { Component } from '@angular/core';
import { ASSETS } from '../../../../core/festival';
import { DraggableSticker } from '../../../../shared/components/draggable-sticker/draggable-sticker';

@Component({
  selector: 'app-hero',
  imports: [DraggableSticker],
  styleUrl: './hero.scss',
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly crowd = ASSETS.images.crowd;

  // Positions are % of the photo frame; negative depth = moves against the cursor
  protected readonly stickers = [
    { src: ASSETS.stickers.starburst, w: 1536, h: 1536, x: -12, y: -14, size: 'clamp(7rem, 14vw, 12rem)', rotation: -12, depth: 40, delay: 0 },
    { src: ASSETS.stickers.sunglasses, w: 1280, h: 800, x: 58, y: 72, size: 'clamp(9rem, 18vw, 16rem)', rotation: 10, depth: -30, delay: 1.2 },
  ];
}
