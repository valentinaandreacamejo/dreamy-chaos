/** Single source of truth for festival-wide constants. */

/** Opening day (local time). The footer countdown points here. */
export const FESTIVAL_START = new Date(2026, 6, 24);

export const ASSETS = {
  stickers: {
    starburst: 'assets/icons/y2k-starburst.png',
    smileyFlower: 'assets/icons/y2k-smiley-flower.png',
    sunglasses: 'assets/icons/y2k-chrome-sunglasses.png',
  },
  images: {
    crowd: 'assets/images/genz-festival-crowd.jpg',
    stage: 'assets/images/dj-stage-lasers.jpg',
  },
} as const;
